import fetch from 'node-fetch';

export default async (req, res) => {
  const url = req.url.replace('/api/proxy', 'http://ec2-43-201-19-45.ap-northeast-2.compute.amazonaws.com:8080');

  try {
    const response = await fetch(url, { method: req.method, headers: req.headers, body: req.body });
    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
};