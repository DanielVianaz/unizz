const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Stricter rate limit for denuncias: 3 per minute
const rateLimitMap = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const max = 3;
  const key = `denuncia:${ip}`;
  const record = rateLimitMap.get(key) || { count: 0, resetAt: now + windowMs };
  if (now > record.resetAt) { record.count = 0; record.resetAt = now + windowMs; }
  record.count++;
  rateLimitMap.set(key, record);
  return record.count > max;
}

function sanitize(str, maxLen) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>"'`]/g, '').trim().slice(0, maxLen || 500);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^\+?[\d\s\-()·]{8,20}$/.test(phone);
}

const VALID_TIPOS = [
  'Assédio ou Discriminação',
  'Incumprimento do Código de Conduta',
  'Conflito de Interesses',
  'Corrupção',
  'Incumprimento de regras de prevenção de branqueamento de capitais e financiamento do terrorismo',
  'Fraude',
  'Furto/Roubo',
  'Incumprimento de regras de sigilo ou segurança da informação',
  'Incumprimento de regras de segurança',
  'Uso Indevido ou desvio de recursos da empresa',
  'Incumprimento de políticas ou normas internas da empresa',
  'Abuso de Confiança',
  'Outro tipo de infração'
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://unicambio.pt');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Demasiados pedidos. Tente novamente em 1 minuto.' });
  }

  const {
    codigo,
    identificado,
    nome,
    email,
    telefone,
    tipo_infracao,
    intervenientes,
    local,
    data_evento,
    descricao,
    tem_documentacao,
    reporte_anterior,
    meio_reporte
  } = req.body || {};

  // Required field validation
  if (!tipo_infracao) return res.status(400).json({ error: 'O tipo de infração é obrigatório.' });
  if (!VALID_TIPOS.includes(tipo_infracao)) return res.status(400).json({ error: 'Tipo de infração inválido.' });
  if (!descricao || typeof descricao !== 'string' || descricao.trim().length < 50) {
    return res.status(400).json({ error: 'A descrição deve ter pelo menos 50 caracteres.' });
  }
  if (!codigo || typeof codigo !== 'string' || !/^DEN-[0-9A-F]{8}$/.test(codigo)) {
    return res.status(400).json({ error: 'Código de referência inválido.' });
  }

  // If identified, validate contact fields
  if (identificado === true || identificado === 'true') {
    if (!nome || typeof nome !== 'string' || nome.trim().length < 2) {
      return res.status(400).json({ error: 'Nome obrigatório quando identificado.' });
    }
    if (!email) return res.status(400).json({ error: 'Email obrigatório quando identificado.' });
    if (!validateEmail(email)) return res.status(400).json({ error: 'Email inválido.' });
    if (telefone && !validatePhone(telefone)) return res.status(400).json({ error: 'Telefone inválido.' });
  }

  // Validate optional date
  if (data_evento && !/^\d{4}-\d{2}-\d{2}$/.test(data_evento)) {
    return res.status(400).json({ error: 'Data de evento inválida.' });
  }

  const isIdentificado = identificado === true || identificado === 'true';

  try {
    const { error } = await supabase.from('denuncias').insert([{
      codigo: sanitize(codigo, 20),
      identificado: isIdentificado,
      nome: isIdentificado && nome ? sanitize(nome, 200) : null,
      email: isIdentificado && email ? sanitize(email, 200) : null,
      telefone: isIdentificado && telefone ? sanitize(telefone, 30) : null,
      tipo_infracao: sanitize(tipo_infracao, 200),
      intervenientes: intervenientes ? sanitize(intervenientes, 1000) : null,
      local: local ? sanitize(local, 300) : null,
      data_evento: data_evento || null,
      descricao: sanitize(descricao, 5000),
      tem_documentacao: tem_documentacao === true || tem_documentacao === 'true',
      reporte_anterior: reporte_anterior === true || reporte_anterior === 'true',
      meio_reporte: meio_reporte ? sanitize(meio_reporte, 500) : null,
      created_at: new Date().toISOString()
    }]);

    if (error) {
      console.error('Supabase error:', error.code);
      return res.status(500).json({ error: 'Erro ao processar. Tente novamente.' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err.message);
    return res.status(500).json({ error: 'Erro interno. Tente mais tarde.' });
  }
};
