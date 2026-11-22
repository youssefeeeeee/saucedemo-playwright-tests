import { test, expect } from '@playwright/test';

const prices = '[data-test="inventory-item-price"]';
const sortDropdown = '[data-test="product-sort-container"]';

async function getPrices(page) {
    const texts = await page.locator(prices).allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '')));
}

test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
});

test('sort by price low to high', async ({ page }) => {
    await page.locator(sortDropdown).selectOption('lohi');
    await expect(page.locator('[data-test="active-option"]')).toHaveText('Price (low to high)');

    const actual = await getPrices(page);
    const expected = [...actual].sort((a, b) => a - b);
    expect(actual).toEqual(expected);
});

test('low to high shows cheapest first and most expensive last', async ({ page }) => {
    await page.locator(sortDropdown).selectOption('lohi');
    await expect(page.locator(prices).first()).toHaveText('$7.99');
    await expect(page.locator(prices).last()).toHaveText('$49.99');
});

test('sort by price high to low', async ({ page }) => {
    await page.locator(sortDropdown).selectOption('hilo');

    const actual = await getPrices(page);
    const expected = [...actual].sort((a, b) => b - a);
    expect(actual).toEqual(expected);
});

test('sorting keeps all 6 products', async ({ page }) => {
    await page.locator(sortDropdown).selectOption('lohi');
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
});
