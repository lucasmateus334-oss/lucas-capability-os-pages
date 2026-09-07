import { expect, test } from '@playwright/test';

test('language switcher toggles EN and PT-BR and persists preference', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Português do Brasil' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.getByRole('link', { name: 'Patrocinar', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sobre' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Registro de capacidades' })).toBeVisible();
  await expect(page.getByPlaceholder('Buscar capacidade')).toBeVisible();
  await expect(page.locator('[data-i18n-html="sponsor.title"]')).toContainText('Patrocine pesquisa');
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

test('about story exposes a clickable evidence trail in both languages', async ({ page }) => {
  await page.goto('./about/');
  await expect(page.getByRole('heading', { name: 'What I’m building now — and where the proof lives.' })).toBeVisible();
  await expect(page.getByRole('link', { name: /PR #5/ })).toHaveAttribute('href', 'https://github.com/lucasmateus334-oss/lucas-capability-os-pages/pull/5');
  await expect(page.getByRole('link', { name: /Protocol spec/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /JSON Schema/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Example receipt/ })).toBeVisible();
  await expect(page.locator('.status-experimental')).toHaveText('EXPERIMENTAL');

  await page.getByRole('button', { name: 'Português do Brasil' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.getByRole('heading', { name: 'O que estou construindo agora — e onde está a prova.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Evidência' })).toBeVisible();
});
