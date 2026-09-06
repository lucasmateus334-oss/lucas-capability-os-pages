import { expect, test, type Page } from '@playwright/test';

const visibleRows = (page: Page) => page.locator('[data-registry-row]:not([hidden])');

const values = async (page: Page, key: 'name' | 'status' | 'ref'): Promise<string[]> =>
  visibleRows(page).evaluateAll((rows, selectedKey) =>
    rows.map((row) => (row as HTMLElement).dataset[selectedKey as 'name' | 'status' | 'ref'] ?? ''), key,
  );

const asc = (items: string[]): string[] => [...items].sort((a, b) => a.localeCompare(b));
const desc = (items: string[]): string[] => asc(items).reverse();

const box = async (page: Page) => {
  const value = await page.locator('[data-capability-registry]').boundingBox();
  if (!value) throw new Error('registry bounding box unavailable');
  return value;
};

test.beforeEach(async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('[data-capability-registry]')).toBeVisible();
});

test('Capability ↕ sorts ascending/descending with stable registry geometry', async ({ page }) => {
  const before = await box(page);
  const button = page.getByRole('button', { name: 'Sort by capability' });

  await button.click();
  expect(await values(page, 'name')).toEqual(desc(await values(page, 'name')));
  await expect(page.locator('[data-sort-column="name"]')).toHaveAttribute('aria-sort', 'descending');

  await button.click();
  expect(await values(page, 'name')).toEqual(asc(await values(page, 'name')));
  await expect(page.locator('[data-sort-column="name"]')).toHaveAttribute('aria-sort', 'ascending');

  const after = await box(page);
  expect(Math.abs(after.width - before.width)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(after.height - before.height)).toBeLessThanOrEqual(0.5);
});

test('Status ↕ sorts deterministically in both directions', async ({ page }) => {
  const button = page.getByRole('button', { name: 'Sort by status' });
  await button.click();
  expect(await values(page, 'status')).toEqual([
    'materialized', 'materialized', 'materialized',
    'scaffold', 'scaffold', 'scaffold', 'scaffold', 'scaffold', 'scaffold',
  ]);
  await expect(page.locator('[data-sort-column="status"]')).toHaveAttribute('aria-sort', 'ascending');

  await button.click();
  expect(await values(page, 'status')).toEqual([
    'scaffold', 'scaffold', 'scaffold', 'scaffold', 'scaffold', 'scaffold',
    'materialized', 'materialized', 'materialized',
  ]);
  await expect(page.locator('[data-sort-column="status"]')).toHaveAttribute('aria-sort', 'descending');
});

test('Public ref ↕ sorts local rows without navigation', async ({ page }) => {
  const url = page.url();
  const button = page.getByRole('button', { name: 'Sort by public reference' });
  await button.click();
  expect(await values(page, 'ref')).toEqual(asc(await values(page, 'ref')));
  await expect(page.locator('[data-sort-column="ref"]')).toHaveAttribute('aria-sort', 'ascending');
  await button.click();
  expect(await values(page, 'ref')).toEqual(desc(await values(page, 'ref')));
  await expect(page.locator('[data-sort-column="ref"]')).toHaveAttribute('aria-sort', 'descending');
  expect(page.url()).toBe(url);
});

test('status filters and search update only local visibility', async ({ page }) => {
  await page.getByRole('button', { name: 'Materialized', exact: true }).click();
  await expect(visibleRows(page)).toHaveCount(3);
  expect(await values(page, 'status')).toEqual(['materialized', 'materialized', 'materialized']);

  await page.getByRole('button', { name: 'Scaffold', exact: true }).click();
  await expect(visibleRows(page)).toHaveCount(6);

  await page.getByRole('button', { name: 'All', exact: true }).click();
  await page.getByPlaceholder('Search capability').fill('assessment');
  await expect(visibleRows(page)).toHaveCount(1);
  await expect(page.locator('[data-result-count]')).toHaveText('1 capability');
});

test('live transition event enables green hardware-accelerated pulse', async ({ page }) => {
  await page.evaluate(() => {
    window.dispatchEvent(
      new CustomEvent('capability:telemetry-mode', {
        detail: { mode: 'live' },
      }),
    );
  });

  await expect(page.locator('[data-telemetry-label]')).toHaveText('Telemetry Mode: Live');
  await expect(page.locator('[data-telemetry-dot]')).toHaveClass(/animate-pulse/);
  await expect(page.locator('[data-telemetry-dot]')).toHaveClass(/is-live/);
  await expect(page.locator('[data-telemetry-mode]')).toHaveAttribute('data-telemetry-mode', 'live');
});
