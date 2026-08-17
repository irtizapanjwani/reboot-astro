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

  // FormSubmit handles delivery, matching the Gold Coast site rather than
  // introducing a second provider. First submission triggers a one-time
  // confirmation email to the address below; after confirming, FormSubmit
  // issues a hashed endpoint that can replace the address here so it is not
  // exposed in the page source (Gold Coast uses the hashed form).
  formEndpoint: 'https://formsubmit.co/robert@zoorepairs.com.au',

  // FormSubmit's CORS-enabled endpoint. The plain endpoint above blocks fetch,
  // so it serves as the no-JavaScript fallback while this one keeps the
  // customer on the page when JS is available.
  formEndpointAjax: 'https://formsubmit.co/ajax/robert@zoorepairs.com.au',

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
