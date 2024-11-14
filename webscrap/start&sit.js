const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeTable(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });

    await page.waitForSelector('tr.even, tr.odd', { timeout: 120000 });

    const records = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('tr.even, tr.odd'));
        return rows.map(row => {
            const cells = row.querySelectorAll('td');
            return {
                team: cells[0]?.innerText.trim(),
                position: cells[1]?.innerText.trim(),
                player: cells[2]?.innerText.trim(),
                metric1: {
                    value: cells[3]?.innerText.trim(),
                    color: cells[3] ? getComputedStyle(cells[3]).backgroundColor : null
                },
                matchup2: {
                    value: parseFloat(cells[10]?.innerText.trim()) || null, // Convert to a number for calculation
                    color: cells[10] ? getComputedStyle(cells[10]).backgroundColor : null
                },
                opp_team: cells[11]?.innerText.trim(),
                opp_position: cells[12]?.innerText.trim(),
                opponent: cells[13]?.innerText.trim()
            };
        });
    });

    // Filter out records with null Advantage values in matchup2
    const validRecords = records.filter(record => record.matchup2.value !== null);

    // Extract Advantage values from matchup2 for deviation calculations
    const advantages = validRecords.map(record => record.matchup2.value);

    // Calculate mean (average) and standard deviation
    const mean = advantages.reduce((sum, value) => sum + value, 0) / advantages.length;
    const variance = advantages.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / advantages.length;
    const stdDev = Math.sqrt(variance);

    // Define thresholds for Start/Sit based on mean and standard deviation
    const startThreshold = mean + stdDev;
    const sitThreshold = mean - stdDev;

    // Add Start/Sit recommendation to each record based on thresholds
    const updatedRecords = records.map(record => {
        if (record.matchup2.value !== null) {
            if (record.matchup2.value >= startThreshold) {
                record.recommendation = "Start";
            } else if (record.matchup2.value <= sitThreshold) {
                record.recommendation = "Sit";
            } else {
                record.recommendation = "Neutral";
            }
        } else {
            record.recommendation = "Data Missing";
        }
        return record;
    });

    const filePath = path.resolve(__dirname, '../webscrap/start&sitJSON.json');

    // Save the updated records with recommendations to JSON
    fs.writeFileSync(filePath, JSON.stringify(updatedRecords, null, 2), 'utf-8');
    console.log('Data saved to start&sitJSON.json');
}

const url = 'https://www.fantasypoints.com/nfl/reports/wr-cb-matchups#/';
scrapeTable(url).catch(error => console.log('Error in scrapping Start & Sit Data, Error: ' + error));

const sevenHours = 7 * 60 * 60 * 1000;
setInterval(() => scrapeTable(url), sevenHours);
