const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function scrapeOdds() {
    try {
        console.log('Fetching the webpage...');
        const { data: html } = await axios.get('https://actionnetwork.com/odds', { timeout: 120000 });

        console.log('Loading HTML into Cheerio...');
        const $ = cheerio.load(html);

        console.log('Extracting odds data...');
        const oddsArray = [];

        $('tr').each((index, row) => {
            const rowData = {};

            // Extract spread, line, and logo data
            $(row).find('div[data-testid="book-cell__odds"]').each((idx, div) => {
                const spread = $(div).find('.css-1qynun2').text().trim() || null;
                const line = $(div).find('.book-cell__secondary').text().trim() || null;
                const logo = $(div).find('span img').attr('src') || null;

                // Map each div to a key like 'one', 'two', etc.
                const key = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][idx] || `extra${idx}`;
                rowData[key] = { spread, line, logo };
            });

            // Extract team names
            const teamName1 = $(row).find('.game-info__team--desktop span').eq(0).text().trim() || null;
            const teamName2 = $(row).find('.game-info__team--desktop span').eq(1).text().trim() || null;

            // Extract team icons
            const teamIcon1 = $(row).find('.game-info__placeholder img').eq(0).attr('src') || null;
            const teamIcon2 = $(row).find('.game-info__placeholder img').eq(1).attr('src') || null;

            // Extract "OPEN" values
            const openSpread1 = $(row).find('.best-odds__open-cell div').eq(0).text().trim() || null;
            const openLine1 = $(row).find('.best-odds__open-cell-secondary div').eq(0).text().trim() || null;
            const openSpread2 = $(row).find('.best-odds__open-cell div').eq(1).text().trim() || null;
            const openLine2 = $(row).find('.best-odds__open-cell-secondary div').eq(1).text().trim() || null;

            if (Object.keys(rowData).length > 0) {
                oddsArray.push({
                    rowData,
                    teamName1,
                    teamName2,
                    teamIcon1,
                    teamIcon2,
                    openSpread1,
                    openLine1,
                    openSpread2,
                    openLine2
                });
            }
        });

        console.log('Saving data to bettingDataJSON.json...');
        const filePath = path.resolve(__dirname, '../webscrap/bettingDataJSON.json');
        fs.writeFileSync(filePath, JSON.stringify(oddsArray, null, 2), 'utf-8');
        console.log('Data saved successfully!');
    } catch (error) {
        console.error('Error occurred:', error.message);
    }
}

const threeHours = 3 * 60 * 60 * 1000;

// Run the scraper immediately and then every 3 hours
setInterval(() => {
    scrapeOdds();
}, threeHours);

scrapeOdds();
