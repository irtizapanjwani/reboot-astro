// Cloudflare Pages Function — POST /api/contact
//
// The contact form previously had no action and no handler, so submissions went
// nowhere and the browser appended the customer's name, phone and email to the
// URL as a query string. This endpoint receives the POST instead.
//
// Requires one environment variable set in the Pages project:
//   RESEND_API_KEY  — from https://resend.com (free tier covers 3,000/month)
//
// If the key is missing the endpoint fails loudly with a 500 rather than
// pretending the message was sent. A form that silently swallows enquiries is
// worse than one that visibly errors.

interface Env {
  RESEND_API_KEY?: string;
}

const RECIPIENT = 'robert@zoorepairs.com.au';
const SENDER = 'Reboot Website <hello@rebootyourcomputer.com.au>';

const MAX = { name: 100, phone: 40, email: 120, message: 4000 } as const;

function clean(value: FormDataEntryValue | null, limit: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, limit);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string
  ));
}

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function reply(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply(400, { ok: false, error: 'Could not read the form data.' });
  }

  // Honeypot: a hidden field real people never fill in. Bots do. Accept the
  // request so the bot sees success, but do not send anything.
  if (clean(form.get('company'), 100)) {
    return reply(200, { ok: true });
  }

  const name = clean(form.get('name'), MAX.name);
  const phone = clean(form.get('phone'), MAX.phone);
  const email = clean(form.get('email'), MAX.email);
  const message = clean(form.get('message'), MAX.message);

  const errors: string[] = [];
  if (!name) errors.push('Please tell us your name.');
  if (!phone && !email) errors.push('Please give us either a phone number or an email address.');
  if (email && !looksLikeEmail(email)) errors.push('That email address does not look right.');
  if (!message) errors.push('Please tell us what is going wrong.');

  if (errors.length) {
    return reply(400, { ok: false, error: errors.join(' ') });
  }

  if (!env.RESEND_API_KEY) {
    console.error('contact form: RESEND_API_KEY is not set — enquiry not delivered', { name, phone, email });
    return reply(500, {
      ok: false,
      error: 'We could not send your message. Please call us instead.',
    });
  }

  const rows: Array<[string, string]> = [
    ['Name', name],
    ['Phone', phone || '(not given)'],
    ['Email', email || '(not given)'],
  ];

  const html = `
    <h2>New enquiry from rebootyourcomputer.com.au</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows.map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`).join('')}
    </table>
    <h3>Message</h3>
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
  `;

  const text = [
    'New enquiry from rebootyourcomputer.com.au',
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    'Message:',
    message,
  ].join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: SENDER,
      to: [RECIPIENT],
      // So hitting reply in the mail client answers the customer, not the site.
      reply_to: email && looksLikeEmail(email) ? email : undefined,
      subject: `Website enquiry — ${name}`,
      html,
      text,
    }),
  });

  if (!res.ok) {
    console.error('contact form: Resend rejected the send', res.status, await res.text());
    return reply(502, {
      ok: false,
      error: 'We could not send your message. Please call us instead.',
    });
  }

  return reply(200, { ok: true });
};

// Anything other than POST on this path.
export const onRequest: PagesFunction<Env> = async ({ request, next }) => {
  if (request.method === 'POST') return next();
  return new Response('Method Not Allowed', { status: 405, headers: { allow: 'POST' } });
};
