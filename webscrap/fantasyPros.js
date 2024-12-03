const puppeteer = require('puppeteer');

const scrapeData = async () => {
    try {
        // Launch Puppeteer browser instance
        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium-browser',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true
        });
        
        const page = await browser.newPage();

        // Navigate to the FantasyPros page
        await page.goto('https://www.fantasypros.com/nfl/points-allowed.php', { waitUntil: 'domcontentloaded' });

        // Wait for the table to load
        await page.waitForSelector('table');

        // Scrape all the <tr> rows containing the team data
        const data = await page.evaluate(() => {
            // Select all the table rows (excluding the header)
            const rows = document.querySelectorAll('tr');
            const results = [];

            rows.forEach(row => {
                const cells = row.querySelectorAll('td');

                // Only process rows that contain data (excluding the header row)
                if (cells.length > 1) {
                    results.push({
                        team: cells[0].innerText.trim(), // Team name
                        column1: cells[1].innerText.trim(),
                        column2: cells[2].innerText.trim(),
                        column3: cells[3].innerText.trim(),
                        column4: cells[4].innerText.trim(),
                        column5: cells[5].innerText.trim(),
                        column6: cells[6].innerText.trim(),
                        column7: cells[7].innerText.trim(),
                        column8: cells[8].innerText.trim(),
                        column9: cells[9].innerText.trim(),
                        column10: cells[10].innerText.trim(),
                        column11: cells[11].innerText.trim(),
                        column12: cells[12].innerText.trim()
                    });
                }
            });

            return results;
        });

        // Close the browser
        await browser.close();

        // You can also write it to a JSON file
        const fs = require('fs');
        const path = require('path');
        const filePath = path.resolve(__dirname, '../webscrap/fantasyProsJSON.json');
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

        console.log('Data saved to fantasyProsJSON.json');
    } catch (error) {
        console.error('Error occurred:', error);
    }
};

const thirtySixHours = 36 * 60 * 60 * 1000;

setInterval(() => {
    scrapeData();
}, thirtySixHours);

scrapeData();
