# saucedemo-playwright-tests

Automated end-to-end tests for the practice shop [Swag Labs (saucedemo.com)](https://www.saucedemo.com), written with [Playwright](https://playwright.dev) in JavaScript.

This is a learning project. The site is a public demo built for testing practice, and the login details used here are the ones the site publishes on its login page.

## What is tested

| File | Tests | What it checks |
|---|---|---|
| `tests/smoke.spec.js` | 3 | Standard user can log in, locked-out user sees an error, inventory shows 6 products |
| `tests/login.spec.js` | 6 | Successful login, error messages (wrong password, empty username, empty password, locked-out user), logout |
| `tests/cart.spec.js` | 6 | Add one or several items, remove from the products page and the cart page, cart page lists the item, continue shopping |
| `tests/checkout.spec.js` | 8 | Information form, validation errors (first name, last name, postal code), overview totals, full purchase, cancel on both steps |
| `tests/sort.spec.js` | 4 | Sort by price low to high and high to low, cheapest and most expensive item positions, all products stay listed |

Tests run in Chromium, Firefox and WebKit (see `playwright.config.js`).

### How the tests are written

- The tests use the **Page Object pattern**: each page of the shop has a class in `pages/` that holds its locators and actions (`LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage`). Tests call methods like `inventory.addToCart('sauce-labs-backpack')` and only contain the checks.
- Each file logs in in a `beforeEach` hook, so tests start from a known state.
- Elements are found with `data-test` attributes or roles, and each locator targets a single element. This avoids Playwright strict mode errors when a locator matches several elements (for example, the six "Add to cart" buttons).
- The cart badge disappears when the cart is empty, so tests check `toHaveCount(0)` instead of looking for a "0".
- Login error cases are data-driven: one list of cases generates one test each.

## Requirements

- [Node.js](https://nodejs.org) (current LTS version)
- npm (comes with Node.js)

## Getting started

```bash
# 1. Clone the repository
git clone https://github.com/youssefeeeeee/saucedemo-playwright-tests.git
cd saucedemo-playwright-tests

# 2. Install dependencies
npm install

# 3. Install the Playwright browsers
npx playwright install
```

## Running the tests

```bash
# Run all tests in all browsers
npx playwright test

# Run one file
npx playwright test tests/checkout.spec.js

# Run in one browser only
npx playwright test --project=chromium

# Run with the browser visible
npx playwright test --headed

# Open the HTML report after a run
npx playwright show-report
```

## Project structure

```
saucedemo-playwright-tests/
├── pages/                   # Page objects (locators and actions per page)
│   ├── LoginPage.js
│   ├── InventoryPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
├── tests/                   # Test files
│   ├── smoke.spec.js        # Quick login and inventory checks
│   ├── login.spec.js        # Login success, errors and logout
│   ├── cart.spec.js         # Add and remove items
│   ├── checkout.spec.js     # Checkout flow and validation
│   └── sort.spec.js         # Product sorting by price
├── playwright.config.js     # Playwright settings (browsers, reports)
├── package.json             # Dependencies
└── .gitignore               # Files kept out of the repository
```

## Roadmap

- [x] More login cases (wrong password, empty fields)
- [x] Add to cart and checkout tests
- [x] Sorting tests
- [x] Page Object pattern to reduce repeated code
- [ ] Run the tests automatically with GitHub Actions
- [ ] API tests
