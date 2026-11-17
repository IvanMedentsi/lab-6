
import { test, expect } from '@playwright/test';
import { USERS } from './data';

test.beforeEach(async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('Username').fill(USERS.standard.username);
  await page.getByPlaceholder('Password').fill(USERS.standard.password);

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/inventory.html/);
});

test('Успішне оформлення замовлення', async ({ page }) => {

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  await page.locator('.shopping_cart_link').click();

  await expect(page).toHaveURL(/cart.html/);

  await page.getByRole('button', { name: 'Checkout' }).click();

  await expect(page).toHaveURL(/checkout-step-one.html/);

  await page.getByPlaceholder('First Name').fill('Ivan');
  await page.getByPlaceholder('Last Name').fill('Petrenko');
  await page.getByPlaceholder('Zip/Postal Code').fill('89600');

  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page).toHaveURL(/checkout-step-two.html/);
  await expect(page.getByText('Checkout: Overview')).toBeVisible();
});

test('Перевірка інформації на сторінці огляду замовлення', async ({ page }) => {

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  await page.locator('.shopping_cart_link').click();

  await page.getByRole('button', { name: 'Checkout' }).click();

  
  await page.getByPlaceholder('First Name').fill('Ivan');
  await page.getByPlaceholder('Last Name').fill('Petrenko');
  await page.getByPlaceholder('Zip/Postal Code').fill('89600');

  await page.getByRole('button', { name: 'Continue' }).click();

  
  await expect(page).toHaveURL(/checkout-step-two.html/);
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();

await expect(
  page.locator('[data-test="inventory-item-price"]')
).toHaveText('$29.99');

await expect(
  page.locator('[data-test="subtotal-label"]')
).toContainText('$29.99');

  await expect(page.getByText('Payment Information')).toBeVisible();
  await expect(page.getByText('Shipping Information')).toBeVisible();

  await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible();
});
