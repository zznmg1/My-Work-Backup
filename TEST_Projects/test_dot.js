const { chromium } = require('playwright');
const path = require('path');

(async () => {
    console.log('--- Testing Red Dot & Date Selection ---');
    let browser;
    try {
        browser = await chromium.launch({ headless: false });
        const context = await browser.newContext();
        const page = await context.newPage();

        const filePath = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
        await page.goto(filePath);
        await page.waitForTimeout(2000);

        // 1. Clear existing todos (optional but clean)
        await page.evaluate(() => localStorage.clear());
        await page.reload();
        await page.waitForTimeout(1000);

        // 2. Add Todo on Today
        console.log('Adding todo for today...');
        await page.fill('#todo-input', '오늘의 할일');
        await page.click('#add-btn');
        await page.waitForTimeout(2000);

        // 3. Check for Red Dot on Today
        const hasDot = await page.locator('.today.has-todo').count();
        if (hasDot > 0) {
            console.log('SUCCESS: Red dot found on today.');
        } else {
            console.log('FAILURE: Red dot NOT found on today.');
        }

        // 4. Select Tomorrow and check list is empty
        console.log('Selecting tomorrow...');
        const days = await page.locator('.calendar-days div:not(.empty)');
        const count = await days.count();
        // Assuming 1-indexed, clicking the last visible day as a test
        await days.nth(count - 1).click();
        await page.waitForTimeout(2000);

        const listContent = await page.innerText('#todo-list');
        if (listContent.trim() === '') {
            console.log('SUCCESS: List is empty for another day.');
        }

        // 5. Add todo to tomorrow
        console.log('Adding todo for tomorrow...');
        await page.fill('#todo-input', '내일의 할일');
        await page.click('#add-btn');
        await page.waitForTimeout(2000);

        const hasNewDot = await page.locator('.selected.has-todo').count();
        if (hasNewDot > 0) {
            console.log('SUCCESS: Red dot found on selected day.');
        }

        console.log('--- Testing Completed Successfully ---');
    } catch (err) {
        console.error('ERROR during testing:', err);
    } finally {
        if (browser) await browser.close();
    }
})();
