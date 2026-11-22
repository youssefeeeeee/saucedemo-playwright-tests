import { test, expect } from '@playwright/test';

const loginErrors = [
    { name: 'wrong password', username: 'standard_user', password: 'wrong pass', message: 'do not match' },
    { name: 'empty username', username: '', password: 'secret_sauce', message: 'Username is required' },
    { name: 'empty password', username: 'standard_user', password: '', message: 'Password is required' },
    { name: 'locked out user', username: 'locked_out_user', password: 'secret_sauce', message: 'locked out' },
];

async function login(page, username, password) {
    await page.getByPlaceholder('Username').fill(username);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
}

test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
});

test('standard user can log in', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
});

for (const c of loginErrors) {
    test(`login error: ${c.name}`, async ({ page }) => {
        await login(page, c.username, c.password);
        await expect(page.locator('[data-test="error"]')).toContainText(c.message);
        await expect(page).not.toHaveURL(/inventory/);
    });
}

test('user can log out', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});
