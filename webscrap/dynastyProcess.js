const { chromium } = require('playwright');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function scrapePlayerData() {
    let browser;
    try {
        // Launch Chromium browser using Playwright
        browser = await chromium.launch({
            headless: true, // Runs in headless mode (no UI)
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

        // Extract the HTML content after the page has loaded
        const pageContent = await page.content();  // Get the full HTML of the page

        // Load the HTML into Cheerio
        const $ = cheerio.load(pageContent);

        // Extract the data from the table using Cheerio
        const data = [];
        $('tr').each((index, row) => {
            const name = $(row).find('.label-cell').text().trim();
            const age = $(row).find('.numeric-cell').eq(0).text().trim();
            const value = parseInt($(row).find('.numeric-cell').eq(1).text().trim(), 10);

            // Filter out rows with no valid name
            if (name && name !== 'Player') {
                data.push({ name, age, value });
            }
        });

        // Save the extracted data to a JSON file
        const filePath = path.resolve(__dirname, '../webscrap/dynastyProcessJSON.json');
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log('Data saved to dynastyProcessJSON.json');
    } catch (error) {
        console.error('Error during scraping:', error.message);
    } finally {
        if (browser) await browser.close();  // Ensure the browser closes properly
    }
}

// Repeat scraping every 35 hours
const thirtyFiveHour = 35 * 60 * 60 * 1000;
setInterval(async () => {
    try {
        await scrapePlayerData();
    } catch (error) {
        console.error('Error in interval function:', error.message);
    }
}, thirtyFiveHour);

// Initial scrape
scrapePlayerData();
