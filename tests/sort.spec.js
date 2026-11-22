import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

let inventory;

test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventory = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user');
});

test('sort by price low to high', async () => {
    await inventory.sortBy('lohi');
    await expect(inventory.activeSort).toHaveText('Price (low to high)');

    const actual = await inventory.getPrices();
    const expected = [...actual].sort((a, b) => a - b);
    expect(actual).toEqual(expected);
});

test('low to high shows cheapest first and most expensive last', async () => {
    await inventory.sortBy('lohi');
    await expect(inventory.prices.first()).toHaveText('$7.99');
    await expect(inventory.prices.last()).toHaveText('$49.99');
});

test('sort by price high to low', async () => {
    await inventory.sortBy('hilo');

    const actual = await inventory.getPrices();
    const expected = [...actual].sort((a, b) => b - a);
    expect(actual).toEqual(expected);
});

test('sorting keeps all 6 products', async () => {
    await inventory.sortBy('lohi');
    await expect(inventory.items).toHaveCount(6);
});
