// Cloudflare Pages Function: gate the contact form behind Turnstile before
// any submission reaches FormSubmit.
//
// Runs server-side (not in the browser), so it isn't subject to the CORS
// restriction that made the old client-side fetch talk to FormSubmit's
// separate /ajax/ endpoint. A bot posting straight to /api/enquiry gets
// nowhere: it can't produce a valid Turnstile token without solving the
// challenge in a real browser, so it never reaches FormSubmit at all.
//
// Env vars, set per Cloudflare Pages project (Settings → Environment
// variables) rather than committed to the repo:
//   TURNSTILE_SECRET_KEY — same value across every site (one shared widget)
//   FORM_ENDPOINT         — this site's FormSubmit address, e.g.
//                           https://formsubmit.co/ajax/robert@zoorepairs.com.au

interface Env {
  TURNSTILE_SECRET_KEY: string;
  FORM_ENDPOINT: string;
}

interface Context {
  request: Request;
  env: Env;
}

export async function onRequestPost({ request, env }: Context): Promise<Response> {
  const acceptsJson = (request.headers.get('accept') ?? '').includes('application/json');

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return fail(acceptsJson, request, 'Malformed submission.', 400);
  }

  // Honeypot. A real visitor never fills this in — bail out quietly rather
  // than spending a Turnstile check or an outbound request on it.
  if (String(data.get('_honey') ?? '').trim()) {
    return succeed(acceptsJson, data);
  }

  const token = String(data.get('cf-turnstile-response') ?? '');
  if (!token) {
    return fail(acceptsJson, request, 'Verification missing. Please try again.', 400);
  }

  const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: request.headers.get('CF-Connecting-IP') ?? '',
    }),
  });
  const verifyBody = await verifyRes.json<{ success: boolean }>().catch(() => ({ success: false }));

  if (!verifyBody.success) {
    return fail(acceptsJson, request, 'Verification failed. Please try again.', 400);
  }

  // Forward everything except the Turnstile token to FormSubmit. Its own
  // captcha doesn't apply to the /ajax/ endpoint anyway — Turnstile is the
  // gate now, so keep _captcha=false regardless of what the form sent.
  const forward = new FormData();
  for (const [key, value] of data.entries()) {
    if (key !== 'cf-turnstile-response') forward.append(key, value);
  }
  forward.set('_captcha', 'false');

  // FormSubmit rejects requests with no Referer ("Make sure you open this
  // page through a web server...") since it uses that header to identify
  // which site is submitting. `Referer` is a forbidden header name per the
  // Fetch spec — setting it via `headers` is silently dropped — so it has
  // to go through fetch's dedicated `referrer` option instead, which is
  // exactly what that option exists for.
  const referer = request.headers.get('referer') ?? new URL(request.url).origin;

  const deliveryRes = await fetch(env.FORM_ENDPOINT, {
    method: 'POST',
    body: forward,
    headers: { accept: 'application/json' },
    referrer: referer,
  });
  const deliveryBody: { success?: string } = await deliveryRes.json().catch(() => ({}));

  if (deliveryRes.ok && String(deliveryBody.success) === 'true') {
    return succeed(acceptsJson, data);
  }
  return fail(acceptsJson, request, 'Delivery failed. Please call instead.', 502);
}

function succeed(acceptsJson: boolean, data: FormData): Response {
  if (acceptsJson) {
    return json({ success: true });
  }
  // No-JS fallback: mirror FormSubmit's own behaviour of redirecting to _next.
  const next = String(data.get('_next') ?? '/');
  return Response.redirect(next, 303);
}

function fail(acceptsJson: boolean, request: Request, message: string, status: number): Response {
  if (acceptsJson) {
    return json({ success: false, message }, status);
  }
  const referer = request.headers.get('referer') ?? '/';
  return new Response(
    `<!doctype html><meta charset="utf-8"><p>${message}</p><p><a href="${referer}">Go back</a></p>`,
    { status, headers: { 'content-type': 'text/html' } }
  );
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
