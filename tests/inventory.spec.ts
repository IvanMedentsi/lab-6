
import { test, expect } from '@playwright/test';
import { USERS } from './data';

test.beforeEach(async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('Username').fill(USERS.standard.username);
  await page.getByPlaceholder('Password').fill(USERS.standard.password);

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/inventory.html/);
});

// Перевірка кількості товарів
test('Каталог містить 6 товарів', async ({ page }) => {
  const products = page.locator('.inventory_item');

  await expect(products).toHaveCount(6);
});

// Сортування товарів від дешевих до дорогих
test('Сортування товарів від дешевих до дорогих', async ({ page }) => {
  const sortDropdown = page.locator('[data-test="product-sort-container"]');

  await sortDropdown.selectOption('lohi');

  const prices = await page.locator('.inventory_item_price').allTextContents();

  const numericPrices = prices.map(price =>
    Number(price.replace('$', ''))
  );

  const sortedPrices = [...numericPrices].sort((a, b) => a - b);

  expect(numericPrices).toEqual(sortedPrices);
});

// Додавання одного товару в кошик
test('Додавання товару в кошик', async ({ page }) => {
  const backpack = page.locator('.inventory_item')
    .filter({ hasText: 'Sauce Labs Backpack' });

  await backpack.getByRole('button', { name: 'Add to cart' }).click();

  const cartBadge = page.locator('.shopping_cart_badge');

  await expect(cartBadge).toHaveText('1');
});

// Видалення товару з кошика
test('Видалення товару з кошика', async ({ page }) => {
  const bikeLight = page.locator('.inventory_item')
    .filter({ hasText: 'Sauce Labs Bike Light' });

  await bikeLight.getByRole('button', { name: 'Add to cart' }).click();

  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  await bikeLight.getByRole('button', { name: 'Remove' }).click();

  await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
});

// Додавання кількох товарів у кошик
test('Додавання кількох товарів у кошик', async ({ page }) => {
  const backpack = page.locator('.inventory_item')
    .filter({ hasText: 'Sauce Labs Backpack' });

  const bikeLight = page.locator('.inventory_item')
    .filter({ hasText: 'Sauce Labs Bike Light' });

  await backpack.getByRole('button', { name: 'Add to cart' }).click();
  await bikeLight.getByRole('button', { name: 'Add to cart' }).click();

  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
});
