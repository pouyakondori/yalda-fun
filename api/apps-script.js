export default async function handler(request, response) {
  const target = process.env.VITE_APPS_SCRIPT_URL || process.env.APPS_SCRIPT_URL;

  if (!target) {
    response.status(500).json({ error: 'Apps Script URL is not configured.' });
    return;
  }

  if (request.method !== 'GET' && request.method !== 'POST') {
    response.setHeader('Allow', 'GET,POST');
    response.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  try {
    const init = { method: request.method, headers: {} };
    let url = target;

    if (request.method === 'POST') {
      init.headers['Content-Type'] = 'application/json';
      const body =
        typeof request.body === 'string' ? request.body : JSON.stringify(request.body ?? {});
      init.body = body;
    } else {
      init.headers['Accept'] = 'application/json';
      if (request.url.includes('?')) {
        url += request.url.slice(request.url.indexOf('?'));
      }
    }

    const upstream = await fetch(url, init);
    const buffer = await upstream.arrayBuffer();
    const contentType = upstream.headers.get('content-type') ?? 'application/json';

    response.status(upstream.status);
    response.setHeader('Content-Type', contentType);
    response.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Apps Script proxy failed', error);
    response.status(502).json({ error: 'Failed to reach Google Apps Script.' });
  }
}
