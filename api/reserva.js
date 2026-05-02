const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Simple in-memory rate limiting
const rateLimitMap = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const max = 5;
  const key = `reserva:${ip}`;
  if (rateLimitMap.size > 5000) {
    for (const [k, v] of rateLimitMap) { if (now > v.resetAt) rateLimitMap.delete(k); }
  }
  const record = rateLimitMap.get(key) || { count: 0, resetAt: now + windowMs };
  if (now > record.resetAt) { record.count = 0; record.resetAt = now + windowMs; }
  record.count++;
  rateLimitMap.set(key, record);
  return record.count > max;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^\+?[\d\s\-()·]{8,20}$/.test(phone);
}

function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>"'`]/g, '').trim().slice(0, 500);
}

const VALID_CURRENCIES = ['USD','GBP','BRL','JPY','CHF','AED','CNY','CAD','AUD','ZAR','TRY','INR','MXN','NOK','SEK','DKK','PLN','HUF','RON','CZK','HKD','SGD','NZD','MYR','SAR','QAR','EGP','ILS','MAD','CVE','MZN','ARS','CLP','DOP','IDR','PHP','KRW','THB','VND','KHR','MOP','RUB','UAH','ISK','XAF','XOF','NAD','COP','TND'];

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://unicambio.pt');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const contentLength = parseInt(req.headers['content-length'] || 0);
  if (contentLength > 10240) return res.status(413).json({ error: 'Payload demasiado grande.' });

  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Demasiados pedidos. Tente novamente em 1 minuto.' });
  }

  const { nome, email, telemovel, moeda, montante, data_levantamento, balcao } = req.body || {};

  // Validate
  if (!nome || !email || !telemovel || !moeda || !montante || !data_levantamento || !balcao) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }
  if (!validateEmail(email)) return res.status(400).json({ error: 'Email inválido.' });
  if (!validatePhone(telemovel)) return res.status(400).json({ error: 'Telefone inválido.' });
  if (!VALID_CURRENCIES.includes(moeda)) return res.status(400).json({ error: 'Moeda inválida.' });
  const amount = parseFloat(montante);
  if (isNaN(amount) || amount < 10 || amount > 50000) return res.status(400).json({ error: 'Montante inválido (10€ – 50.000€).' });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data_levantamento)) return res.status(400).json({ error: 'Data inválida.' });

  try {
    const { error } = await supabase.from('reservas').insert([{
      nome: sanitize(nome),
      email: sanitize(email),
      telemovel: sanitize(telemovel),
      moeda,
      montante: amount,
      data_levantamento,
      balcao: sanitize(balcao),
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
