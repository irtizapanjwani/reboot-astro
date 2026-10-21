import { defineConfig } from 'tinacms';

export default defineConfig({
  branch: process.env.TINA_BRANCH || process.env.HEAD || 'main',
  clientId: process.env.TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        label: 'Homepage',
        name: 'home',
        path: 'src/content/home',
        format: 'json',
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => '/',
        },
        fields: [
          {
            type: 'string',
            name: 'heroBody',
            label: 'Hero Body',
            ui: { component: 'textarea', description: 'The H1 "Computer Repairs Brisbane" is locked and not editable here — it drives real Google rankings, see SEO-BASELINE.md before ever changing it.' },
          },
          { type: 'string', name: 'introBody', label: 'Intro Strip Text', ui: { component: 'textarea' } },
          {
            type: 'object',
            name: 'services',
            label: 'What We Fix (services)',
            list: true,
            ui: { itemProps: (item) => ({ label: item?.symptom || item?.title }) },
            fields: [
              { type: 'string', name: 'symptom', label: 'Headline, in the customer\'s words', ui: { description: 'What the customer notices, e.g. "I can\'t get my files back". Shown large.' } },
              { type: 'string', name: 'title', label: 'Service name (small label)', ui: { description: 'Also used as the page anchor the diagnostic links to, so rename with care.' } },
              { type: 'string', name: 'icon', label: 'Icon (emoji, not currently shown)' },
              { type: 'string', name: 'points', label: 'What\'s covered (3-4 short items)', list: true },
              { type: 'string', name: 'parts', label: 'Laptop parts to light up', list: true, options: ['screen', 'board', 'drive', 'battery', 'wifi', 'ports'] },
              { type: 'string', name: 'body', label: 'Description', ui: { component: 'textarea' } },
            ],
          },
          {
            type: 'object',
            name: 'whyUs',
            label: 'Why Choose Reboot (items)',
            list: true,
            ui: { itemProps: (item) => ({ label: item?.title }) },
            fields: [
              { type: 'string', name: 'title', label: 'Title' },
              { type: 'string', name: 'body', label: 'Body', ui: { component: 'textarea' } },
            ],
          },
          { type: 'string', name: 'ctaHeading', label: 'Closing CTA Heading' },
          { type: 'string', name: 'ctaBody', label: 'Closing CTA Body' },
        ],
      },
      {
        label: 'About Page',
        name: 'about',
        path: 'src/content/about',
        format: 'json',
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => '/about',
        },
        fields: [
          { type: 'string', name: 'heroHeading', label: 'Hero Heading' },
          { type: 'string', name: 'heroBody', label: 'Hero Body', ui: { component: 'textarea' } },
          {
            type: 'object',
            name: 'sections',
            label: 'Body Sections',
            list: true,
            ui: { itemProps: (item) => ({ label: item?.heading }) },
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              { type: 'string', name: 'body', label: 'Body', ui: { component: 'textarea' } },
              {
                type: 'string',
                name: 'bullets',
                label: 'Bullet Points (optional)',
                list: true,
              },
            ],
          },
          { type: 'string', name: 'ctaHeading', label: 'Closing CTA Heading' },
          { type: 'string', name: 'ctaBody', label: 'Closing CTA Body' },
        ],
      },
    ],
  },
});
