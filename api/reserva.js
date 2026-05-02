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
  if (await isRateLimited(ip, 'reserva')) {
    return res.status(429).json({ error: 'Demasiados pedidos. Tente novamente em 1 minuto.' });
  }

  const { nome, email, telemovel, moeda, montante, data_levantamento, balcao } = req.body || {};

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
