import { test, expect } from '@playwright/test';

test('renders the standalone builder canvas', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Daily Social Pulse')).toBeVisible();
  await expect(page.getByText('standalone · 0 nodes · 0 edges')).toBeVisible();
  await expect(page.getByText('Node Library')).toBeHidden();
});
