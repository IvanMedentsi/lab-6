
import { test, expect } from '@playwright/test';
import { USERS } from './data';

test('Успішна авторизація', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('Username').fill(USERS.standard.username);
  await page.getByPlaceholder('Password').fill(USERS.standard.password);

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/inventory.html/);
  await expect(page.getByText('Products')).toBeVisible();
});

test('Заблокований користувач не може увійти', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('Username').fill(USERS.locked.username);
  await page.getByPlaceholder('Password').fill(USERS.locked.password);

  await page.getByRole('button', { name: 'Login' }).click();

  const error = page.locator('[data-test="error"]');

  await expect(error).toBeVisible();
  await expect(error).toContainText('locked out');
  await expect(page).not.toHaveURL(/inventory.html/);
});

test('Авторизація з порожніми полями', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Login' }).click();

  const error = page.locator('[data-test="error"]');

  await expect(error).toBeVisible();
  await expect(error).toContainText('Username is required');
});
