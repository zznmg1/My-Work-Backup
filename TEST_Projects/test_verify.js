const { chromium } = require('playwright');
const path = require('path');

(async () => {
    console.log('--- Testing Started ---');
    let browser;
    try {
        browser = await chromium.launch({ headless: false });
        const context = await browser.newContext();
        const page = await context.newPage();

        const filePath = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
        console.log('Opening:', filePath);

        await page.goto(filePath);
        await page.waitForTimeout(2000); // 2초 대기

        // 1. Verify Calendar
        const calendarMonth = await page.innerText('#current-month-year');
        console.log('Calendar Month found:', calendarMonth);

        // 2. Verify Title
        const headerText = await page.innerText('.todo-card header h1');
        console.log('Header found:', headerText);

        // 2. Add Task
        console.log('Adding task: "천천히 진행하는 테스트"');
        await page.fill('#todo-input', '천천히 진행하는 테스트');
        await page.waitForTimeout(1500); // 입력 후 1.5초 대기
        await page.click('#add-btn');
        await page.waitForTimeout(2000); // 추가 후 2초 대기

        // 3. Verify Task Added
        const todoListText = await page.innerText('#todo-list');
        console.log('Todo List Content:', todoListText);

        if (todoListText.includes('천천히 진행하는 테스트')) {
            console.log('SUCCESS: Task added successfully.');
        }

        // 4. Toggle Task (Complete)
        console.log('Toggling task completion...');
        await page.click('.checkbox');
        await page.waitForTimeout(2000); // 완료 체크 후 2초 대기

        // 5. Delete Task
        console.log('Deleting task...');
        await page.click('.delete-btn');
        await page.waitForTimeout(2500); // 삭제 후 애니메이션 확인을 위해 2.5초 대기

        console.log('--- Testing Completed Successfully ---');
    } catch (err) {
        console.error('ERROR during testing:', err);
    } finally {
        if (browser) await browser.close();
    }
})();
