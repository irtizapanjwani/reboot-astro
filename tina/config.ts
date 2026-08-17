import { defineConfig } from 'tinacms';

export default defineConfig({
  branch: 'main',
  clientId: process.env.TINA_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',
  build: {
    outputDir: 'admin',
    publicDir: 'public',
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
        label: 'Pages',
        name: 'pages',
        path: 'src/content/pages',
        format: 'json',
        fields: [
          {
            type: 'object',
            list: true,
            name: 'sections',
            label: 'Page Sections',
            ui: {
              itemProps: (item) => ({
                label: item?.type || 'Section',
              }),
            },
            fields: [
              {
                name: 'type',
                label: 'Section Type',
                type: 'string',
                options: ['hero', 'services', 'features', 'testimonials', 'cta'],
              },
              {
                name: 'heading',
                label: 'Heading',
                type: 'string',
              },
              {
                name: 'subheading',
                label: 'Subheading',
                type: 'string',
              },
              {
                name: 'content',
                label: 'Content',
                type: 'rich-text',
              },
              {
                name: 'ctaText',
                label: 'Button Text',
                type: 'string',
              },
              {
                name: 'ctaLink',
                label: 'Button Link',
                type: 'string',
              },
            ],
          },
        ],
      },
    ],
  },
});
