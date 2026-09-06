import { defineConfig } from 'astro/config';

const base = '/lucas-capability-os-pages';

export default defineConfig({
  output: 'static',
  site: 'https://lucasmateus334-oss.github.io',
  base,
  vite: {
    plugins: [
      {
        name: 'capability-public-client-assets',
        transformIndexHtml() {
          return [
            {
              tag: 'link',
              attrs: {
                rel: 'stylesheet',
                href: `${base}/responsive-guard.css`,
              },
              injectTo: 'head',
            },
            {
              tag: 'script',
              attrs: {
                type: 'module',
                src: `${base}/live-telemetry.js`,
              },
              injectTo: 'body',
            },
          ];
        },
      },
    ],
  },
});
