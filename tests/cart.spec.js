import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

const backpack = 'sauce-labs-backpack';
const bikeLight = 'sauce-labs-bike-light';

let inventory;
let cart;

test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventory = new InventoryPage(page);
    cart = new CartPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user');
});

test('add an item to the cart', async () => {
    await inventory.addToCart(backpack);
    await expect(inventory.removeButton(backpack)).toBeVisible();
    await expect(inventory.cartBadge).toHaveText('1');
});

test('add multiple items to the cart', async () => {
    await inventory.addToCart(backpack);
    await inventory.addToCart(bikeLight);
    await expect(inventory.cartBadge).toHaveText('2');
});

test('remove an item from the cart', async () => {
    await inventory.addToCart(backpack);
    await inventory.removeFromCart(backpack);
    await expect(inventory.addButton(backpack)).toBeVisible();
    await expect(inventory.cartBadge).toHaveCount(0);
});

test('cart page lists the added item', async ({ page }) => {
    await inventory.addToCart(backpack);
    await inventory.openCart();
    await expect(page).toHaveURL(/cart/);
    await expect(cart.itemNames).toHaveText('Sauce Labs Backpack');
});

test('remove an item from the cart page', async () => {
    await inventory.addToCart(backpack);
    await inventory.openCart();
    await cart.remove(backpack);
    await expect(cart.items).toHaveCount(0);
    await expect(inventory.cartBadge).toHaveCount(0);
});

test('continue shopping returns to the products', async ({ page }) => {
    await inventory.openCart();
    await cart.continueShopping();
    await expect(page).toHaveURL(/inventory/);
});
