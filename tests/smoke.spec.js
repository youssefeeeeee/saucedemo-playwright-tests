import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

let loginPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(page.getByText('Swag Labs', { exact: true })).toBeVisible();
});

test('standard user can log in', async ({ page }) => {
    await loginPage.login('standard_user');
    await expect(page).toHaveURL(/inventory/);
});

test('locked out user sees an error', async () => {
    await loginPage.login('locked_out_user');
    await expect(loginPage.error).toContainText('locked out');
});

test('inventory page shows 6 products', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await loginPage.login('standard_user');
    await expect(inventory.items).toHaveCount(6);
});
