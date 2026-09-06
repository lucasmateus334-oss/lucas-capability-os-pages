import { defineConfig } from 'astro/config';

const base = '/lucas-capability-os-pages';
const responsiveGuard = `
@media (max-width: 640px) {
  .hero { grid-template-columns: minmax(0, 1fr); }
  .hero > * { min-width: 0; max-width: 100%; }
  .hero h1 { width: 100%; font-size: clamp(48px, 15vw, 64px); letter-spacing: -0.075em; }
  .masthead > *, main, .hero-bottom, .system-section, .evidence-section, .tier-section, .registry-section, [data-capability-registry] { min-width: 0; }
}
`;

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
              tag: 'style',
              children: responsiveGuard,
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
