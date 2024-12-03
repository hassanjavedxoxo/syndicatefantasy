const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapePlayerData() {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true, // Use false for debugging
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        console.log('Navigating to the page...');
        await page.goto('https://calc.dynastyprocess.com/');

        console.log('Waiting for tab link...');
        await page.waitForSelector('a[data-tab="#tabs-Values"]', { timeout: 120000 });
        await page.click('a[data-tab="#tabs-Values"]');

        console.log('Waiting for table rows...');
        await page.waitForSelector('tr', { timeout: 120000 });

        console.log('Extracting data...');
        const data = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('tr'));
            return rows
                .map(row => {
                    const name = row.querySelector('.label-cell')?.textContent.trim();
                    const age = row.querySelectorAll('.numeric-cell')[0]?.textContent.trim();
                    const value = parseInt(row.querySelectorAll('.numeric-cell')[1]?.textContent.trim());
                    return { name, age, value };
                })
                .filter(item => item?.name && item.name !== 'Player');
        });

        const filePath = path.resolve(__dirname, '../webscrap/dynastyProcessJSON.json');
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log('Data saved to dynastyProcessJSON.json');
    } catch (error) {
        console.error('Error during scraping:', error.message);
    } finally {
        if (browser) await browser.close();
    }
}

const thirtyFiveHour = 35 * 60 * 60 * 1000;
setInterval(async () => {
    try {
        await scrapePlayerData();
    } catch (error) {
        console.error('Error in interval function:', error.message);
    }
}, thirtyFiveHour);

scrapePlayerData();
