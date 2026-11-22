export class InventoryPage {
    constructor(page) {
        this.page = page;
        this.title = page.locator('[data-test="title"]');
        this.items = page.locator('[data-test="inventory-item"]');
        this.prices = page.locator('[data-test="inventory-item-price"]');
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.cartLink = page.locator('.shopping_cart_link');
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
        this.activeSort = page.locator('[data-test="active-option"]');
    }

    // slug is the product id used by the site, e.g. 'sauce-labs-backpack'
    addButton(slug) {
        return this.page.locator(`[data-test="add-to-cart-${slug}"]`);
    }

    removeButton(slug) {
        return this.page.locator(`[data-test="remove-${slug}"]`);
    }

    async addToCart(slug) {
        await this.addButton(slug).click();
    }

    async removeFromCart(slug) {
        await this.removeButton(slug).click();
    }

    async openCart() {
        await this.cartLink.click();
    }

    // value: 'az', 'za', 'lohi' or 'hilo'
    async sortBy(value) {
        await this.sortDropdown.selectOption(value);
    }

    async getPrices() {
        const texts = await this.prices.allTextContents();
        return texts.map((t) => parseFloat(t.replace('$', '')));
    }

    async logout() {
        await this.page.getByRole('button', { name: 'Open Menu' }).click();
        await this.page.locator('[data-test="logout-sidebar-link"]').click();
    }
}
