// Single source of truth for business facts.
//
// The phone number deliberately lives here and nowhere else. It is rendered as
// visible text on the contact page only, but it also has to appear in the
// homepage meta description (verbatim from the page that currently ranks) and
// in the LocalBusiness schema, where Google reads it. Changing it here changes
// it everywhere.
//
// Pricing, hours and service area are the real values from the live site —
// see SEO-BASELINE.md. Do not replace them with guesses.

export const business = {
  name: 'Reboot Computer Repairs',
  site: 'https://www.rebootyourcomputer.com.au',

  phone: '(07) 3155 2002',
  phoneHref: 'tel:+61731552002',
  phoneNote: 'Number diverts straight to a technician’s mobile.',

  // Public-facing address shown on the site.
  email: 'hello@rebootyourcomputer.com.au',

  // Where contact-form submissions are delivered. Not shown on the site.
  formRecipient: 'robert@zoorepairs.com.au',

  // Forms POST to our own /api/enquiry (functions/api/enquiry.ts), which
  // verifies a Turnstile token server-side before forwarding to FormSubmit.
  // The actual FormSubmit address is no longer in the client bundle — it
  // lives only in that Cloudflare Pages project's FORM_ENDPOINT env var
  // (Settings → Environment variables), alongside TURNSTILE_SECRET_KEY.
  formAction: '/api/enquiry',

  // Turnstile's public site key. Safe to commit — it identifies the widget,
  // not a secret. Widget "Zoo Repairs - contact forms" in the Zoo Digital
  // Cloudflare account, covering rebootyourcomputer.com.au and
  // computersgoldcoast.com.au (add more hostnames there, up to 10, as this
  // pattern rolls out to other sites — same site key everywhere).
  turnstileSiteKey: '0x4AAAAAAEvyDTREu8mNJdHL',

  hours: {
    opens: '07:00',
    closes: '22:00',
    summary: 'Open 7 AM to 10 PM every day, including public holidays.',
  },

  areasServed: ['Brisbane', 'Logan', 'Ipswich', 'Moreton Bay', 'Redland Bay'],

  // Rates raised from $120/hr to $150/hr on 2026-08-17, with the after-first-hour
  // increment scaled from $25 to $37.50 per 15 minutes to match.
  rates: {
    workshop: { price: '$150', unit: 'per hour' },
    onsite: { price: '$150', unit: 'first hour, then $37.50 per 15 minutes' },
    remote: { price: '$37.50', unit: 'per 15 minutes' },
  },
} as const;
