const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');  // Import path module to handle file paths

async function scrapePlayers() {
    try {
        const { data } = await axios.get(`https://www.fantasypros.com/nfl/reports/leaders/?year=${new Date().getFullYear()}`);  // replace with the actual URL of the page
        const $ = cheerio.load(data);

        const players = [];
        $('tr[class^="mpb-player"]').each((i, row) => {
            const player = {};
            player.rank = $(row).find('.player-rank').text().trim();
            player.name = $(row).find('.player-name').text().trim();
            player.position = $(row).find('td.center').eq(0).text().trim(); // Updated to select "Position"
            player.team = $(row).find('td.center').eq(1).text().trim(); // Updated to select "Team"

            // Extract the stats (skip the first 4 td.center and get all stats before avg and total)
            player.stats = $(row).find('td.center').slice(2, -2).map((i, td) => $(td).text().trim()).get();

            // Extract avg and total
            player.avg = $(row).find('td.center').eq(-2).text().trim();
            player.total = $(row).find('td.center').last().text().trim();

            players.push(player);
        });

        // Use path.join to create a reliable file path
        const filePath = path.resolve(__dirname, '../webscrap/pastProductionJSON.json');

        // Save the scraped data to the file
        fs.writeFile(filePath, JSON.stringify(players, null, 2), (err) => {
            if (err) {
                console.error('Error saving data to file:', err);
            } else {
                console.log('Data saved to pastProductionJSON.json');
            }
        });
    } catch (error) {
        console.log('Error occured while scraping Past Production Data, Error: ' + error);
    }

}

setInterval(() => {
    scrapePlayers();
}, 1000 * 60 * 60 * 24);  // 1 day interval (24 hours)

scrapePlayers();  // Run once immediately
