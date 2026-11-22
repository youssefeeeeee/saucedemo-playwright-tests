# saucedemo-playwright-tests

Automated end-to-end tests for the practice shop [Swag Labs (saucedemo.com)](https://www.saucedemo.com), written with [Playwright](https://playwright.dev) in JavaScript.

This is a learning project. The site is a public demo built for testing practice, and the login details used here are the ones the site publishes on its login page.

## What is tested

| Test | What it checks |
|---|---|
| Standard user can log in | A valid user logs in and lands on the products page |
| Locked out user sees an error | A locked-out user cannot log in and sees an error message |

Tests are in `tests/smoke.spec.js` and run in Chromium, Firefox and WebKit (see `playwright.config.js`).

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
├── tests/                  # Test files
│   └── smoke.spec.js       # Login smoke tests
├── playwright.config.js    # Playwright settings (browsers, reports)
├── package.json            # Dependencies
└── .gitignore              # Files kept out of the repository
```

## Roadmap

- [ ] More login cases (wrong password, empty fields)
- [ ] Add to cart and checkout tests
- [ ] Page Object pattern to reduce repeated code
- [ ] Run the tests automatically with GitHub Actions
- [ ] API tests
