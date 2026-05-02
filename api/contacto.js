const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const rateLimitMap = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const max = 5;
  const key = `contacto:${ip}`;
  if (rateLimitMap.size > 5000) {
    for (const [k, v] of rateLimitMap) { if (now > v.resetAt) rateLimitMap.delete(k); }
  }
  const record = rateLimitMap.get(key) || { count: 0, resetAt: now + windowMs };
  if (now > record.resetAt) { record.count = 0; record.resetAt = now + windowMs; }
  record.count++;
  rateLimitMap.set(key, record);
  return record.count > max;
}

function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>"'`]/g, '').trim().slice(0, 2000);
}

const VALID_ASSUNTOS = ['Reserva de Moeda','Western Union','Compra de Ouro','Crédito Pessoal','Empresas','Outro'];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://unicambio.pt');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const contentLength = parseInt(req.headers['content-length'] || 0);
  if (contentLength > 10240) return res.status(413).json({ error: 'Payload demasiado grande.' });

  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(ip)) return res.status(429).json({ error: 'Demasiados pedidos. Tente novamente em 1 minuto.' });

  const { nome, email, assunto, mensagem } = req.body || {};

  if (!nome || !email || !mensagem) return res.status(400).json({ error: 'Preencha todos os campos.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Email inválido.' });
  if (!VALID_ASSUNTOS.includes(assunto)) return res.status(400).json({ error: 'Assunto inválido.' });
  if (mensagem.trim().length < 5) return res.status(400).json({ error: 'Mensagem demasiado curta.' });

  try {
    const { error } = await supabase.from('contactos').insert([{
      nome: sanitize(nome),
      email: sanitize(email),
      assunto: sanitize(assunto),
      mensagem: sanitize(mensagem),
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
