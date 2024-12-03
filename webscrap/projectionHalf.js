const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeProjections(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });

    // Adjust selector to wait for the table rows with player data
    await page.waitForSelector('tr.mpb-player-16393', { timeout: 120000 });

    const projections = await page.evaluate(() => {
        // Select all relevant <tr> elements with player data
        const rows = Array.from(document.querySelectorAll('tr.mpb-player-16393, tr[class*="mpb-player-"]'));

        return rows.map(row => {
            const cells = row.querySelectorAll('td');
            
            return {
                playerName: cells[0]?.querySelector('.player-name')?.innerText.trim(),
                team: cells[0]?.innerText.split(' ').pop().trim(),
                position: cells[1]?.innerText.trim(),
                metric1: parseFloat(cells[2]?.innerText.trim()) || null,  // Example metric - adjust as needed
                metric2: parseFloat(cells[3]?.innerText.trim()) || null,
                metric3: parseFloat(cells[4]?.innerText.trim()) || null,
                metric4: parseFloat(cells[5]?.innerText.trim()) || null,
                metric5: parseFloat(cells[6]?.innerText.trim()) || null,
                metric6: parseFloat(cells[7]?.innerText.trim()) || null,
                matchup1: parseFloat(cells[8]?.innerText.trim()) || null,
                matchup2: parseFloat(cells[9]?.innerText.trim()) || null,
                finalProjection: parseFloat(cells[10]?.dataset.sortValue) || null // Get numeric sort value if available
            };
        });
    });

    await browser.close();

    const filePath = path.resolve(__dirname, '../webscrap/projectionHalfJSON.json');

    // Save the projections to a JSON file
    fs.writeFileSync(filePath, JSON.stringify(projections, null, 2), 'utf-8');
    console.log('Data saved to projectionHalfJSON.json');
}

const url = 'https://www.fantasypros.com/nfl/projections/flex.php?scoring=HALF';  // Replace with the actual URL
try {
    scrapeProjections(url);
} catch (error) {
    console.log('Error occured while scraping Projection Half Data, Error: ' + error);
}


const nineHours = 9 * 60 * 60 * 1000;
setInterval(() => scrapeProjections(url), nineHours);
