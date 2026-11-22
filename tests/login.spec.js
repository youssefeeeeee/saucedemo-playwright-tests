import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

const loginErrors = [
    { name: 'wrong password', username: 'standard_user', password: 'wrong pass', message: 'do not match' },
    { name: 'empty username', username: '', password: 'secret_sauce', message: 'Username is required' },
    { name: 'empty password', username: 'standard_user', password: '', message: 'Password is required' },
    { name: 'locked out user', username: 'locked_out_user', password: 'secret_sauce', message: 'locked out' },
];

let loginPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
});

test('standard user can log in', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await loginPage.login('standard_user');
    await expect(page).toHaveURL(/inventory/);
    await expect(inventory.title).toHaveText('Products');
});

for (const c of loginErrors) {
    test(`login error: ${c.name}`, async ({ page }) => {
        await loginPage.login(c.username, c.password);
        await expect(loginPage.error).toContainText(c.message);
        await expect(page).not.toHaveURL(/inventory/);
    });
}

test('user can log out', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await loginPage.login('standard_user');
    await inventory.logout();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.loginButton).toBeVisible();
});
