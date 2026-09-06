import { readFile, writeFile } from 'node:fs/promises';
import { defineConfig } from 'astro/config';

const base = '/lucas-capability-os-pages';
const responsiveGuard = `
<style data-responsive-guard>
@media (max-width: 640px) {
  .hero { grid-template-columns: minmax(0, 1fr); }
  .hero > * { min-width: 0; max-width: 100%; }
  .hero h1 { width: 100%; font-size: clamp(48px, 15vw, 64px); letter-spacing: -0.075em; }
  .masthead > *, main, .hero-bottom, .system-section, .evidence-section, .tier-section, .registry-section, [data-capability-registry] { min-width: 0; }
}
</style>`;

const publicSurfaceIntegration = {
  name: 'capability-public-surface-postbuild',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const indexUrl = new URL('index.html', dir);
      let html = await readFile(indexUrl, 'utf8');
      if (!html.includes('data-responsive-guard')) {
        html = html.replace('</head>', `${responsiveGuard}</head>`);
      }
      if (!html.includes('live-telemetry.js')) {
        html = html.replace('</body>', `<script type="module" src="${base}/live-telemetry.js"></script></body>`);
      }
      await writeFile(indexUrl, html, 'utf8');
    },
  },
};

export default defineConfig({
  output: 'static',
  site: 'https://lucasmateus334-oss.github.io',
  base,
  integrations: [publicSurfaceIntegration],
});
