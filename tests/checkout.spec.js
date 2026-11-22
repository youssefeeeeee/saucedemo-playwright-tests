import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

const backpack = 'sauce-labs-backpack';

let inventory;
let cart;
let checkout;

test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventory = new InventoryPage(page);
    cart = new CartPage(page);
    checkout = new CheckoutPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user');
});

async function goToCheckoutInfo() {
    await inventory.addToCart(backpack);
    await inventory.openCart();
    await cart.checkout();
}

test('checkout button opens the information form', async ({ page }) => {
    await goToCheckoutInfo();
    await expect(page).toHaveURL(/checkout-step-one/);
    await expect(checkout.title).toHaveText('Checkout: Your Information');
});

test('error shown when first name is missing', async () => {
    await goToCheckoutInfo();
    await checkout.fillInfo('', 'Doe', '12345');
    await checkout.continue();
    await expect(checkout.error).toHaveText('Error: First Name is required');
});

test('error shown when last name is missing', async () => {
    await goToCheckoutInfo();
    await checkout.fillInfo('John', '', '12345');
    await checkout.continue();
    await expect(checkout.error).toHaveText('Error: Last Name is required');
});

test('error shown when postal code is missing', async () => {
    await goToCheckoutInfo();
    await checkout.fillInfo('John', 'Doe', '');
    await checkout.continue();
    await expect(checkout.error).toHaveText('Error: Postal Code is required');
});

test('overview page shows the selected item and totals', async ({ page }) => {
    await goToCheckoutInfo();
    await checkout.fillInfo();
    await checkout.continue();
    await expect(page).toHaveURL(/checkout-step-two/);
    await expect(checkout.itemName).toHaveText('Sauce Labs Backpack');
    await expect(checkout.subtotal).toHaveText('Item total: $29.99');
    await expect(checkout.tax).toHaveText('Tax: $2.40');
    await expect(checkout.total).toHaveText('Total: $32.39');
});

test('complete a purchase end to end', async ({ page }) => {
    await goToCheckoutInfo();
    await checkout.fillInfo();
    await checkout.continue();
    await checkout.finish();
    await expect(page).toHaveURL(/checkout-complete/);
    await expect(checkout.completeHeader).toHaveText('Thank you for your order!');
    await checkout.backToProducts();
    await expect(page).toHaveURL(/inventory/);
    await expect(inventory.cartBadge).toHaveCount(0);
});

test('cancel on the information form returns to the cart', async ({ page }) => {
    await goToCheckoutInfo();
    await checkout.cancel();
    await expect(page).toHaveURL(/cart/);
});

test('cancel on the overview page returns to the products', async ({ page }) => {
    await goToCheckoutInfo();
    await checkout.fillInfo();
    await checkout.continue();
    await checkout.cancel();
    await expect(page).toHaveURL(/inventory/);
});
