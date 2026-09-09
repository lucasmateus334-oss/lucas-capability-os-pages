import { expect, test, type Page } from '@playwright/test';

const TEST_DESTINATION = Array.from({ length: 8 }, (_, i) => String(i + 1)).join('');
const ALT_DESTINATION = Array.from({ length: 8 }, (_, i) => String(8 - i)).join('');
const TEST_PIN = 'relaypass';

async function saveBinding(page: Page, phone = TEST_DESTINATION, pin = TEST_PIN) {
  await page.getByLabel('Meu número').fill(phone);
  await page.getByLabel('PIN local').first().fill(pin);
  await page.getByRole('button', { name: 'Salvar vínculo criptografado' }).click();
  await expect(page.getByText('Vínculo salvo. O telefone em texto puro não foi persistido.')).toBeVisible();
}

test('zero-cost relay encrypts self binding and opens only the bound destination', async ({ page }) => {
  await page.goto('relay/');

  await expect(page.getByRole('heading', { name: 'Capability Lab Relay' })).toBeVisible();
  await saveBinding(page);

  const stored = await page.evaluate(() => localStorage.getItem('caplab.relay.self.v1'));
  expect(stored).toBeTruthy();
  expect(stored).not.toContain(TEST_DESTINATION);
  expect(stored).toContain('ciphertext');

  await page.getByLabel('Mensagem').fill('CAPLAB-RELAY-ZERO-COST-TEST');
  await page.getByLabel('PIN local').last().fill(TEST_PIN);

  await page.route('https://wa.me/**', (route) => route.abort());
  const requestPromise = page.waitForRequest((request) => request.url().startsWith('https://wa.me/'));
  await page.getByRole('button', { name: 'Abrir meu WhatsApp' }).click();
  const request = await requestPromise;

  expect(request.url()).toContain(`https://wa.me/${TEST_DESTINATION}?text=CAPLAB-RELAY-ZERO-COST-TEST`);
});

test('AI handoff pre-fills only the message and removes it from the URL', async ({ page }) => {
  const message = 'Mensagem criada pela IA — ação real sem escolher destinatário.';
  await page.goto(`relay/#text=${encodeURIComponent(message)}`);

  await expect(page.getByLabel('Mensagem')).toHaveValue(message);
  await expect(page.getByText('Mensagem recebida da IA. Confirme o conteúdo e use seu PIN para abrir seu próprio WhatsApp.')).toBeVisible();
  await expect(page).toHaveURL(/\/relay\/$/);
});

test('AI handoff cannot override the locally bound destination', async ({ page }) => {
  await page.goto('relay/');
  await saveBinding(page);

  await page.goto(`relay/#text=${encodeURIComponent('CAPLAB-AI-PREFILL')}&phone=${ALT_DESTINATION}`);

  await expect(page.getByText('Link rejeitado: a IA só pode preencher a mensagem, nunca o destinatário.')).toBeVisible();
  await expect(page.getByLabel('Mensagem')).toHaveValue('');
  await expect(page).toHaveURL(/\/relay\/$/);
});

test('legacy packed fragment remains compatible and still uses the local destination', async ({ page }) => {
  await page.goto('relay/');
  await saveBinding(page);

  const packed = Buffer.from('CAPLAB-PACKED-AI-HANDOFF', 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

  await page.goto(`relay/#m=${packed}`);
  await expect(page.getByLabel('Mensagem')).toHaveValue('CAPLAB-PACKED-AI-HANDOFF');
  await page.getByLabel('PIN local').last().fill(TEST_PIN);

  await page.route('https://wa.me/**', (route) => route.abort());
  const requestPromise = page.waitForRequest((request) => request.url().startsWith('https://wa.me/'));
  await page.getByRole('button', { name: 'Abrir meu WhatsApp' }).click();
  const request = await requestPromise;

  expect(request.url()).toContain(`https://wa.me/${TEST_DESTINATION}?text=CAPLAB-PACKED-AI-HANDOFF`);
});

// O que isso faz: valida em navegador real que mensagens vindas da IA podem ser pré-preenchidas sem expor ou permitir alteração do destino criptografado localmente.
