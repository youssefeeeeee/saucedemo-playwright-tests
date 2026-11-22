import { test, expect } from '@playwright/test';

async function login(page, username, password = 'secret_sauce') {
    await page.getByPlaceholder('Username').fill(username);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
}

test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await expect(page.getByText('Swag Labs', { exact: true })).toBeVisible();
});

test('standard user can log in', async ({ page }) => {
    await login(page, 'standard_user');
    await expect(page).toHaveURL(/inventory/);
});

test('locked out user sees an error', async ({ page }) => {
    await login(page, 'locked_out_user');
    await expect(page.locator('[data-test="error"]')).toContainText('locked out');
});

test('inventory page shows 6 products', async ({ page }) => {
    await login(page, 'standard_user');
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
});
