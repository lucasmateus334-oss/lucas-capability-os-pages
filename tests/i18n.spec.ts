import { expect, test } from '@playwright/test';

test('language switcher toggles EN and PT-BR and persists preference', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Português do Brasil' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.getByRole('link', { name: 'Patrocinar' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Registro de capacidades' })).toBeVisible();
  await expect(page.getByPlaceholder('Buscar capacidade')).toBeVisible();
  await expect(page.getByText('Patrocine pesquisa em capacidades de IA reproduzíveis.')).toBeVisible();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.getByRole('button', { name: 'Português do Brasil' })).toHaveAttribute('aria-pressed', 'true');

  await page.getByRole('button', { name: 'English' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { name: 'Capability registry' })).toBeVisible();
});

test('sponsor CTA points to GitHub Sponsors and page remains indexable', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index,follow');
  const sponsorLinks = page.locator('a[href="https://github.com/sponsors/lucasmateus334-oss"]');
  await expect(sponsorLinks.first()).toBeVisible();
  expect(await sponsorLinks.count()).toBeGreaterThanOrEqual(2);
});
