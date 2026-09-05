import { getStore } from '@netlify/blobs';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 10 * 60 * 1000; // 10 минут блокировки после превышения лимита

export default async (req, context) => {
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
  const ip = (context && context.ip) || 'unknown';
  const rateStore = getStore('compass-arena-ratelimit');
  const rateKey = 'ip:' + ip;

  // ---- Проверка блокировки по перебору пароля ----
  const now = Date.now();
  let record = await rateStore.get(rateKey, { type: 'json' });
  if (record && now - record.firstAttempt < LOCKOUT_MS && record.count >= MAX_ATTEMPTS) {
    const waitMin = Math.ceil((LOCKOUT_MS - (now - record.firstAttempt)) / 60000);
    return new Response(
      'Слишком много неверных попыток. Попробуйте снова через ' + waitMin + ' мин.',
      { status: 429 }
    );
  }
  // Окно сброшено — начинаем считать заново
  if (record && now - record.firstAttempt >= LOCKOUT_MS) {
    record = null;
  }

  // The real password lives only here, as a Netlify environment variable —
  // it is never sent to the browser and never appears in any file you deploy.
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    const next = record
      ? { count: record.count + 1, firstAttempt: record.firstAttempt }
      : { count: 1, firstAttempt: now };
    await rateStore.setJSON(rateKey, next);
    return new Response('Forbidden', { status: 403 });
  }

  // Пароль верный — сбрасываем счётчик неудачных попыток для этого IP.
  if (record) await rateStore.delete(rateKey);

  if (!data || typeof data !== 'object') {
    return new Response('Bad request: missing data', { status: 400 });
  }

  const store = getStore('compass-arena');
  await store.setJSON('tournament', data);

  return Response.json({ ok: true });
};

export const config = { path: '/api/save' };
