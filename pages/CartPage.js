export class CartPage {
    constructor(page) {
        this.page = page;
        this.items = page.locator('[data-test="inventory-item"]');
        this.itemNames = page.locator('[data-test="inventory-item-name"]');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    }

    removeButton(slug) {
        return this.page.locator(`[data-test="remove-${slug}"]`);
    }

    async remove(slug) {
        await this.removeButton(slug).click();
    }

    async checkout() {
        await this.checkoutButton.click();
    }

    async continueShopping() {
        await this.continueShoppingButton.click();
    }
}
