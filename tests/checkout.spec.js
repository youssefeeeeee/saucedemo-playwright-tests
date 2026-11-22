import { test, expect } from '@playwright/test';

const backpack = '[data-test="add-to-cart-sauce-labs-backpack"]';

test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
});

async function goToCheckoutInfo(page) {
    await page.locator(backpack).click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
}

async function fillInfo(page, first = 'John', last = 'Doe', zip = '12345') {
    await page.locator('[data-test="firstName"]').fill(first);
    await page.locator('[data-test="lastName"]').fill(last);
    await page.locator('[data-test="postalCode"]').fill(zip);
}

test('checkout button opens the information form', async ({ page }) => {
    await goToCheckoutInfo(page);
    await expect(page).toHaveURL(/checkout-step-one/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');
});

test('error shown when first name is missing', async ({ page }) => {
    await goToCheckoutInfo(page);
    await fillInfo(page, '', 'Doe', '12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: First Name is required');
});

test('error shown when last name is missing', async ({ page }) => {
    await goToCheckoutInfo(page);
    await fillInfo(page, 'John', '', '12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: Last Name is required');
});

test('error shown when postal code is missing', async ({ page }) => {
    await goToCheckoutInfo(page);
    await fillInfo(page, 'John', 'Doe', '');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: Postal Code is required');
});

test('overview page shows the selected item and totals', async ({ page }) => {
    await goToCheckoutInfo(page);
    await fillInfo(page);
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-two/);
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $29.99');
    await expect(page.locator('[data-test="tax-label"]')).toHaveText('Tax: $2.40');
    await expect(page.locator('[data-test="total-label"]')).toHaveText('Total: $32.39');
});

test('complete a purchase end to end', async ({ page }) => {
    await goToCheckoutInfo(page);
    await fillInfo(page);
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(/checkout-complete/);
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
});

test('cancel on the information form returns to the cart', async ({ page }) => {
    await goToCheckoutInfo(page);
    await page.locator('[data-test="cancel"]').click();
    await expect(page).toHaveURL(/cart/);
});

test('cancel on the overview page returns to the products', async ({ page }) => {
    await goToCheckoutInfo(page);
    await fillInfo(page);
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="cancel"]').click();
    await expect(page).toHaveURL(/inventory/);
});
