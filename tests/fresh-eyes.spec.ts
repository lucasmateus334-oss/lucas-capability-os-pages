import { expect, test, type Page } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const capture = async (page: Page, name: string): Promise<void> => {
  await mkdir('artifacts/fresh-eyes', { recursive: true });
  await page.screenshot({ path: `artifacts/fresh-eyes/${name}.png`, fullPage: true });
};

const persistGeometry = async (name: string, geometry: unknown): Promise<void> => {
  await mkdir('artifacts/fresh-eyes', { recursive: true });
  await writeFile(`artifacts/fresh-eyes/${name}-geometry.json`, `${JSON.stringify(geometry, null, 2)}\n`, 'utf8');
};

const documentGeometry = async (page: Page) =>
  page.evaluate(() => {
    const viewport = window.innerWidth;
    const offenders = Array.from(document.querySelectorAll<HTMLElement>('body *'))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          id: element.id,
          className: String(element.className),
          left: Math.round(rect.left * 100) / 100,
          right: Math.round(rect.right * 100) / 100,
          width: Math.round(rect.width * 100) / 100,
        };
      })
      .filter((item) => item.right > viewport || item.left < 0)
      .slice(0, 12);

    return {
      viewport,
      scrollWidth: document.documentElement.scrollWidth,
      overflow: document.documentElement.scrollWidth - viewport,
      offenders,
    };
  });

const mockLiveExperiment = async (page: Page) => {
  await page.route('https://capability-os-home-base-cs16-previe.vercel.app/api/live-experiment', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        baseline: 'Make a checklist, assign owners and meet weekly.',
        trace: {
          goal: 'Launch a reviewable process without losing important context.',
          known: 'The team has many applicants and information is scattered.',
          plan: 'Separate criteria, evidence, owners and checkpoints.',
          critique: 'The first draft could still hide assumptions and inconsistent criteria.',
          review: 'A person should verify criteria, exceptions and final prioritization.'
        },
        clab: 'Define the goal, separate known facts from assumptions, create explicit review criteria, link each conclusion to evidence, mark unknowns, and add a human checkpoint before prioritization.',
        evaluation: {
          clarity: { baseline: 2.5, clab: 3.8, why: 'B makes the operating steps explicit.' },
          traceability: { baseline: 1.5, clab: 4, why: 'B links conclusions to evidence and checkpoints.' },
          uncertainty: { baseline: 1.5, clab: 3.8, why: 'B keeps assumptions and unknowns visible.' },
          reviewability: { baseline: 2, clab: 4, why: 'B adds explicit human review points.' }
        },
        disclosure: 'Visible trace contains concise work-state summaries, not private chain-of-thought. Scores are model-assisted comparison, not scientific validation.'
      })
    });
  });
};

test('desktop fresh-eyes surface remains contained', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('./');
  await expect(page.locator('[data-capability-registry]')).toBeVisible();
  const geometry = await documentGeometry(page);
  await persistGeometry('home-base-desktop', geometry);
  expect(geometry.overflow, JSON.stringify(geometry, null, 2)).toBe(0);
  await capture(page, 'home-base-desktop');
});

test('mobile fresh-eyes surface contains wide registry inside its scroller', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await expect(page.locator('[data-capability-registry]')).toBeVisible();
  const geometry = await documentGeometry(page);
  await persistGeometry('home-base-mobile', geometry);
  expect(geometry.overflow, JSON.stringify(geometry, null, 2)).toBe(0);
  await expect(page.locator('.table-wrap')).toHaveCSS('overflow-x', 'auto');
  await capture(page, 'home-base-mobile');
});

test('interactive impact demo exposes clear scenario and progressive step controls', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('./#impact-demo');
  const demo = page.locator('[data-impact-demo]');
  await expect(demo).toBeVisible();
  await expect(demo.locator('[data-field="label"]')).toHaveText('Recruiting scenario');
  await expect(demo.locator('[data-progress]')).toHaveText('1');
  await expect(demo.locator('[data-step="0"]')).toHaveAttribute('aria-current', 'step');

  await demo.locator('[data-next]').click();
  await expect(demo.locator('[data-progress]')).toHaveText('2');
  await expect(demo.locator('[data-step="1"]')).toHaveAttribute('aria-current', 'step');
  await expect(demo.locator('[data-active-kicker]')).toContainText('STRUCTURE');

  await demo.locator('[data-step="3"]').click();
  await expect(demo.locator('[data-progress]')).toHaveText('4');
  await expect(demo.locator('[data-result]')).toHaveClass(/is-revealed/);
  await expect(demo.locator('[data-next]')).toHaveText('Restart ↺');

  await demo.locator('[data-scenario="learning"]').click();
  await expect(demo.locator('[data-field="label"]')).toHaveText('Learning & Operations scenario');
  await expect(demo.locator('[data-field="title"]')).toContainText('onboarding');
  await expect(demo.locator('[data-progress]')).toHaveText('1');

  await demo.locator('[data-scenario="community"]').click();
  await expect(demo.locator('[data-field="label"]')).toHaveText('Community / Public Value scenario');
  await expect(demo.locator('[data-field="value"]')).toContainText('transparency');
  await expect(demo).toContainText('does not send or store visitor data');

  const geometry = await documentGeometry(page);
  expect(geometry.overflow, JSON.stringify(geometry, null, 2)).toBe(0);
  await capture(page, 'impact-demo-desktop');
});

test('mobile impact demo keeps scenario, step and result interactions readable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./#impact-demo');
  const demo = page.locator('[data-impact-demo]');
  await expect(demo).toBeVisible();
  await demo.locator('[data-scenario="community"]').click();
  await expect(demo.locator('[data-field="label"]')).toHaveText('Community / Public Value scenario');
  await demo.locator('[data-next]').click();
  await expect(demo.locator('[data-progress]')).toHaveText('2');
  await demo.locator('[data-step="3"]').click();
  await expect(demo.locator('[data-result]')).toHaveClass(/is-revealed/);
  const geometry = await documentGeometry(page);
  expect(geometry.overflow, JSON.stringify(geometry, null, 2)).toBe(0);
  await capture(page, 'impact-demo-mobile');
});

test('desktop live experiment shows visible C Lab work and comparison result', async ({ page }) => {
  await mockLiveExperiment(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('./#live-experiment');
  const live = page.locator('[data-live-lab]');
  await expect(live).toBeVisible();
  await live.locator('[data-sample]').first().click();
  await live.locator('[data-run]').click();
  await expect(live.locator('[data-working]')).toBeVisible();
  await expect(live.locator('[data-results]')).toBeVisible({ timeout: 10000 });
  await expect(live.locator('[data-trace="goal"]')).toContainText('reviewable process');
  await expect(live.locator('[data-clab-answer]')).toContainText('human checkpoint');
  await expect(live.locator('[data-score-grid]')).toContainText('Traceability');
  await expect(live).toContainText('not private chain-of-thought');
  const geometry = await documentGeometry(page);
  await persistGeometry('live-experiment-desktop', geometry);
  expect(geometry.overflow, JSON.stringify(geometry, null, 2)).toBe(0);
  await capture(page, 'live-experiment-desktop');
});

test('mobile live experiment remains usable and contained', async ({ page }) => {
  await mockLiveExperiment(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./#live-experiment');
  const live = page.locator('[data-live-lab]');
  await expect(live).toBeVisible();
  await live.locator('[data-sample]').nth(1).click();
  await live.locator('[data-run]').click();
  await expect(live.locator('[data-results]')).toBeVisible({ timeout: 10000 });
  const geometry = await documentGeometry(page);
  await persistGeometry('live-experiment-mobile', geometry);
  expect(geometry.overflow, JSON.stringify(geometry, null, 2)).toBe(0);
  await capture(page, 'live-experiment-mobile');
});

test('desktop professional portfolio is recruiter-readable and contained', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('./portfolio/');
  await expect(page.locator('#page-title')).toContainText('Talent Acquisition');
  await expect(page.locator('.experience-list')).toBeVisible();
  await expect(page.locator('#evidence')).toBeVisible();
  await expect(page.locator('#rnd')).toBeVisible();
  const geometry = await documentGeometry(page);
  await persistGeometry('professional-portfolio-desktop', geometry);
  expect(geometry.overflow, JSON.stringify(geometry, null, 2)).toBe(0);
  await capture(page, 'professional-portfolio-desktop');
});

test('mobile professional portfolio keeps identity, CTA and sections readable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./portfolio/');
  await expect(page.locator('#page-title')).toContainText('Recruiting Operations');
  await expect(page.locator('.actions .primary')).toHaveText('View LinkedIn');
  await expect(page.locator('.experience-list')).toBeVisible();
  const geometry = await documentGeometry(page);
  await persistGeometry('professional-portfolio-mobile', geometry);
  expect(geometry.overflow, JSON.stringify(geometry, null, 2)).toBe(0);
  await capture(page, 'professional-portfolio-mobile');
});
