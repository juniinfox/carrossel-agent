export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};
  const apiKey = req.headers['x-api-key'] || body.apiKey;

  console.log('Headers received:', JSON.stringify(req.headers));
  console.log('API Key found:', apiKey ? 'YES' : 'NO');

  if (!apiKey) return res.status(400).json({ error: 'API key required', headers: Object.keys(req.headers) });

  try {
    const { apiKey: _, ...cleanBody } = body;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(cleanBody.model ? cleanBody : body)
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
