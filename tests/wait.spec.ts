
import { test, expect } from '@playwright/test';
import { USERS } from './data';

test('Експеримент: автоматичне очікування Playwright', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('Username').fill(USERS.slow.username);
  await page.getByPlaceholder('Password').fill(USERS.slow.password);

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/inventory.html/);

  await expect(page.locator('.inventory_item')).toHaveCount(6);
});
