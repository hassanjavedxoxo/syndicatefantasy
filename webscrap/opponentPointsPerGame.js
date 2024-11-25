const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Function to scrape data
const scrapeData = async () => {
    try {
        // Fetch the page HTML using axios
        const { data } = await axios.get('https://www.teamrankings.com/nfl/stat/opponent-points-per-game');

        // Load the HTML into cheerio
        const $ = cheerio.load(data);

        // Scrape the data from the table rows
        const tableRows = [];
        $('table tbody tr').each((index, row) => {
            const cells = $(row).find('td');
            if (cells.length >= 7) {
                const rank = $(cells[0]).text().trim();
                const team = $(cells[1]).text().trim().toLocaleLowerCase();
                const stat1 = $(cells[2]).text().trim();
                const stat2 = $(cells[3]).text().trim();
                const stat3 = $(cells[4]).text().trim();
                const stat4 = $(cells[5]).text().trim();
                const stat5 = $(cells[6]).text().trim();
                const stat6 = $(cells[7]).text().trim();

                tableRows.push({ rank, team, stat1, stat2, stat3, stat4, stat5, stat6 });
            }
        });

        // Optionally, save the data to a file
        const filePath = path.resolve(__dirname, '../webscrap/opponentPointsPerGameJSON.json');
        fs.writeFileSync(filePath, JSON.stringify(tableRows, null, 2), 'utf8');
        console.log('Data saved to opponentPointsPerGameJSON.json');

    } catch (error) {
        console.error('Error occurred:', error.message);
    }
};

// Run the scraper initially
scrapeData();

// Set interval to run the scraper every 38 hours (38 hours = 38 * 60 * 60 * 1000 ms)
const interval = 38 * 60 * 60 * 1000;  // 38 hours in milliseconds

setInterval(scrapeData, interval);
