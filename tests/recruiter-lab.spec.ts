import { test, expect } from '@playwright/test';

test('Recruiter Lab stays pre-launch, provider-decoupled and playable', async ({ page }) => {
  await page.goto('legal-recruiter-lab/');

  await expect(page).toHaveTitle(/Legal Recruiter Lab/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
  await expect(page.getByText('PRE-LAUNCH TEST MODE', { exact: false }).first()).toBeVisible();

  const checkout = page.getByRole('link', { name: /Preview test checkout/ }).first();
  await expect(checkout).toHaveAttribute('href', /lemonsqueezy\.com\/checkout\/buy\//);

  await expect(page.getByText('0 / 3 complete')).toBeVisible();
  await page.getByRole('button', { name: 'Ask what the candidate personally drafted or negotiated.' }).click();
  await page.getByRole('button', { name: 'Busy doing what specifically — and is the work lender-side or borrower-side?' }).click();
  await page.getByRole('button', { name: 'Whether this is a recurring structural issue or a temporary frustration.' }).click();

  await expect(page.getByText('3 / 3 complete')).toBeVisible();
  await expect(page.getByText('300', { exact: true })).toBeVisible();
  await expect(page.getByText(/Operator Readiness: 100%/)).toBeVisible();
});

// Flow note — This browser test protects the pre-launch checkout boundary and the core evidence-first learning interaction.
