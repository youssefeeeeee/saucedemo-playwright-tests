import { test, expect } from '@playwright/test';

const addBackpack = '[data-test="add-to-cart-sauce-labs-backpack"]';
const removeBackpack = '[data-test="remove-sauce-labs-backpack"]';
const addBikeLight = '[data-test="add-to-cart-sauce-labs-bike-light"]';
const badge = '.shopping_cart_badge';

test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
});

test('add an item to the cart', async ({ page }) => {
    await page.locator(addBackpack).click();
    await expect(page.locator(removeBackpack)).toBeVisible();
    await expect(page.locator(badge)).toHaveText('1');
});

test('add multiple items to the cart', async ({ page }) => {
    await page.locator(addBackpack).click();
    await page.locator(addBikeLight).click();
    await expect(page.locator(badge)).toHaveText('2');
});

test('remove an item from the cart', async ({ page }) => {
    await page.locator(addBackpack).click();
    await page.locator(removeBackpack).click();
    await expect(page.locator(addBackpack)).toBeVisible();
    await expect(page.locator(badge)).toHaveCount(0);
});

test('cart page lists the added item', async ({ page }) => {
    await page.locator(addBackpack).click();
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/cart/);
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
});

test('remove an item from the cart page', async ({ page }) => {
    await page.locator(addBackpack).click();
    await page.locator('.shopping_cart_link').click();
    await page.locator(removeBackpack).click();
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
    await expect(page.locator(badge)).toHaveCount(0);
});

test('continue shopping returns to the products', async ({ page }) => {
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="continue-shopping"]').click();
    await expect(page).toHaveURL(/inventory/);
});
