import { expect, test, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const capture = async (page: Page, name: string): Promise<void> => {
  await mkdir('artifacts/fresh-eyes', { recursive: true });
  await page.screenshot({ path: `artifacts/fresh-eyes/${name}.png`, fullPage: true });
};

test('desktop fresh-eyes surface remains contained', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('./');
  await expect(page.locator('[data-capability-registry]')).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await capture(page, 'home-base-desktop');
});

test('mobile fresh-eyes surface contains wide registry inside its scroller', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await expect(page.locator('[data-capability-registry]')).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.locator('.table-wrap')).toHaveCSS('overflow-x', 'auto');
  await capture(page, 'home-base-mobile');
});
