const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function isRateLimited(ip, endpoint) {
  const max = 5;
  const since = new Date(Date.now() - 60000).toISOString();
  try {
    const { count } = await supabase
      .from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('ip', ip)
      .eq('endpoint', endpoint)
      .gte('criado_em', since);
    if (count >= max) return true;
    await supabase.from('rate_limits').insert({ ip, endpoint });
    if (Math.random() < 0.02) {
      await supabase.from('rate_limits')
        .delete()
        .lt('criado_em', new Date(Date.now() - 120000).toISOString());
    }
    return false;
  } catch {
    return false;
  }
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

const VALID_AREAS = [
  'Atendimento ao Público',
  'Gestão / Liderança',
  'Financeiro / Câmbios',
  'Compliance / Jurídico',
  'Tecnologia / Digital',
  'Comercial / Parcerias',
  'Outra'
];

const VALID_LOCAIS = [
  'Lisboa',
  'Porto',
  'Algarve',
  'Centro (Coimbra / Leiria)',
  'Madeira',
  'Açores',
  'Indiferente'
];

const VALID_DISPONIBILIDADES = [
  'Imediata',
  '1 mês',
  '2 a 3 meses',
  'Mais de 3 meses'
];

module.exports = async (req, res) => {
  const origin = req.headers.origin || '';
  const allowed = ['https://unicambio.pt', 'https://www.unicambio.pt'];
  const isProjectPreview = /^https:\/\/unizz(-[a-z0-9]+-danielvianazs-projects)?\.vercel\.app$/.test(origin);
  if (allowed.includes(origin) || isProjectPreview) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const contentLength = parseInt(req.headers['content-length'] || 0);
  if (contentLength > 10240) return res.status(413).json({ error: 'Payload demasiado grande.' });

  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',').pop().trim() : req.socket?.remoteAddress || 'unknown';
  if (await isRateLimited(ip, 'candidatura')) {
    return res.status(429).json({ error: 'Demasiados pedidos. Tente novamente em 1 minuto.' });
  }

  const { nome, email, telefone, area, localidade, disponibilidade, mensagem, rgpd } = req.body || {};

  if (!nome || typeof nome !== 'string' || nome.trim().length < 2) {
    return res.status(400).json({ error: 'Nome obrigatório.' });
  }
  if (!email) return res.status(400).json({ error: 'Email obrigatório.' });
  if (!validateEmail(email)) return res.status(400).json({ error: 'Email inválido.' });
  if (!rgpd || rgpd === false || rgpd === 'false') {
    return res.status(400).json({ error: 'É necessário aceitar a Política de Privacidade.' });
  }

  if (telefone && !validatePhone(telefone)) {
    return res.status(400).json({ error: 'Telefone inválido.' });
  }
  if (area && !VALID_AREAS.includes(area)) {
    return res.status(400).json({ error: 'Área de interesse inválida.' });
  }
  if (localidade && !VALID_LOCAIS.includes(localidade)) {
    return res.status(400).json({ error: 'Localidade inválida.' });
  }
  if (disponibilidade && !VALID_DISPONIBILIDADES.includes(disponibilidade)) {
    return res.status(400).json({ error: 'Disponibilidade inválida.' });
  }

  try {
    const { error } = await supabase.from('candidaturas').insert([{
      nome: sanitize(nome, 200),
      email: sanitize(email, 200),
      telefone: telefone ? sanitize(telefone, 30) : null,
      area: area ? sanitize(area, 100) : null,
      localidade: localidade ? sanitize(localidade, 100) : null,
      disponibilidade: disponibilidade ? sanitize(disponibilidade, 50) : null,
      mensagem: mensagem ? sanitize(mensagem, 3000) : null,
      rgpd: true,
      criado_em: new Date().toISOString()
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
