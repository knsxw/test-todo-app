const db = require('../../src/persistence');
const addItem = require('../../src/routes/addItem');
const ITEM = { id: 12345 };
const puppeteer = require('puppeteer');


describe('Add new item from UI', () => {
    // it('should be titled "Google"', async () => {
    //     const browser = await puppeteer.launch();
    //     const page = await browser.newPage()
    //     await page.goto('https://google.com');
    //     await expect(page.title()).resolves.toMatch('Google');
    //     await browser.close();
    // });

    test('It should add new item from UI', async () => {

        const browser = await puppeteer.launch();
        const page = await browser.newPage()
        await page.goto('http://localhost:3000/');
        await expect(page.title()).resolves.toMatch('Todo App');
        
        // await page.$eval('#root > div > div > div > form > div > input', el => el.value = 'Test Item From Jest');
        const inputSelector = '#root > div > div > div > form > div > input'
        await page.waitForSelector(inputSelector);
        await page.focus(inputSelector)        
        await page.keyboard.type('Test Item from Puppeteer')
        await page.keyboard.type(String.fromCharCode(13));

        await db.init();
        const items = await db.getItems();
        expect(items[items.length-1].name).toBe('Test Item from Puppeteer');

        // expect(items[0]).toEqual(ITEM);
        // expect(items[items.length-1]).toEqual(ITEM);

        await browser.close();
    });
});
