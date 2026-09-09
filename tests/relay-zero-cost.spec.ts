import { expect, test } from '@playwright/test';

test('zero-cost relay encrypts self binding and opens only the bound destination', async ({ page }) => {
  await page.goto('relay/');

  await expect(page.getByRole('heading', { name: 'Capability Lab Relay' })).toBeVisible();
  await page.getByLabel('Meu número').fill('5511999999999');
  await page.getByLabel('PIN local').first().fill('123456');
  await page.getByRole('button', { name: 'Salvar vínculo criptografado' }).click();
  await expect(page.getByText('Vínculo salvo. O telefone em texto puro não foi persistido.')).toBeVisible();

  const stored = await page.evaluate(() => localStorage.getItem('caplab.relay.self.v1'));
  expect(stored).toBeTruthy();
  expect(stored).not.toContain('5511999999999');
  expect(stored).toContain('ciphertext');

  await page.getByLabel('Mensagem').fill('CAPLAB-RELAY-ZERO-COST-TEST');
  await page.getByLabel('PIN local').last().fill('123456');

  await page.route('https://wa.me/**', (route) => route.abort());
  const requestPromise = page.waitForRequest((request) => request.url().startsWith('https://wa.me/'));
  await page.getByRole('button', { name: 'Abrir meu WhatsApp' }).click();
  const request = await requestPromise;

  expect(request.url()).toContain('https://wa.me/5511999999999?text=CAPLAB-RELAY-ZERO-COST-TEST');
});

// O que isso faz: valida em navegador real que o destino vem do vínculo criptografado e não de um campo controlado pela IA.
