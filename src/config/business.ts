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

  email: 'info@rebootyourcomputer.com.au',

  hours: {
    opens: '07:00',
    closes: '22:00',
    summary: 'Open 7 AM to 10 PM every day, including public holidays.',
  },

  areasServed: ['Brisbane', 'Logan', 'Ipswich', 'Moreton Bay', 'Redland Bay'],

  rates: {
    workshop: '$120 per hour',
    onsite: '$120 first hour, then $25 per 15 minutes',
    remote: '$25 per 15 minutes',
  },
} as const;
