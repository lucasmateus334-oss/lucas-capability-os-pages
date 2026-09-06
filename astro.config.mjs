import { defineConfig } from 'astro/config';

const base = '/lucas-capability-os-pages';

export default defineConfig({
  output: 'static',
  site: 'https://lucasmateus334-oss.github.io',
  base,
  vite: {
    plugins: [
      {
        name: 'capability-live-telemetry-client',
        transformIndexHtml() {
          return [
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
