export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};
  
  // Pega a chave do header OU do body
  const apiKey = req.headers['x-api-key'] 
    || req.headers['X-Api-Key']
    || body.apiKey
    || body.api_key;

  if (!apiKey) {
    return res.status(400).json({ 
      error: 'API key required',
      receivedHeaders: Object.keys(req.headers),
      hasBody: !!req.body
    });
  }

  const { apiKey: _a, api_key: _b, ...cleanBody } = body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(cleanBody)
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
