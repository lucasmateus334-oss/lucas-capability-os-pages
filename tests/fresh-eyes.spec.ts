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

test('interactive impact demo switches contexts without leaving the public snapshot', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('./#impact-demo');
  const demo = page.locator('[data-impact-demo]');
  await expect(demo).toBeVisible();
  await expect(demo.locator('[data-field="label"]')).toHaveText('Recruiting scenario');
  await demo.locator('[data-scenario="learning"]').click();
  await expect(demo.locator('[data-field="label"]')).toHaveText('Learning & Operations scenario');
  await expect(demo.locator('[data-field="title"]')).toContainText('onboarding');
  await demo.locator('[data-scenario="community"]').click();
  await expect(demo.locator('[data-field="label"]')).toHaveText('Community / Public Value scenario');
  await expect(demo.locator('[data-field="value"]')).toContainText('transparency');
  await expect(demo).toContainText('does not send or store visitor data');
  const geometry = await documentGeometry(page);
  expect(geometry.overflow, JSON.stringify(geometry, null, 2)).toBe(0);
  await capture(page, 'impact-demo-desktop');
});

test('mobile impact demo remains readable and interactive', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./#impact-demo');
  const demo = page.locator('[data-impact-demo]');
  await expect(demo).toBeVisible();
  await demo.locator('[data-scenario="community"]').click();
  await expect(demo.locator('[data-field="label"]')).toHaveText('Community / Public Value scenario');
  const geometry = await documentGeometry(page);
  expect(geometry.overflow, JSON.stringify(geometry, null, 2)).toBe(0);
  await capture(page, 'impact-demo-mobile');
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
