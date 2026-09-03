import { getStore } from '@netlify/blobs';

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  const { password, data } = body || {};

  // The real password lives only here, as a Netlify environment variable —
  // it is never sent to the browser and never appears in any file you deploy.
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return new Response('Forbidden', { status: 403 });
  }

  if (!data || typeof data !== 'object') {
    return new Response('Bad request: missing data', { status: 400 });
  }

  const store = getStore('compass-arena');
  await store.setJSON('tournament', data);

  return Response.json({ ok: true });
};

export const config = { path: '/api/save' };
