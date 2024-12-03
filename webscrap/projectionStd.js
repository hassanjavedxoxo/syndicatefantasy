const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function scrapeProjections(url) {
    try {
        // Fetch the HTML content
        const { data: html } = await axios.get(url, { timeout: 120000 });

        // Load the HTML into Cheerio
        const $ = cheerio.load(html);

        // Select the table rows with player data
        const rows = $('tr.mpb-player-16393, tr[class*="mpb-player-"]');
        const projections = [];

        rows.each((index, row) => {
            const cells = $(row).find('td');

            const projection = {
                playerName: $(cells[0]).find('.player-name').text().trim(),
                team: $(cells[0]).text().split(' ').pop().trim(),
                position: $(cells[1]).text().trim(),
                metric1: parseFloat($(cells[2]).text().trim()) || null, // Example metric
                metric2: parseFloat($(cells[3]).text().trim()) || null,
                metric3: parseFloat($(cells[4]).text().trim()) || null,
                metric4: parseFloat($(cells[5]).text().trim()) || null,
                metric5: parseFloat($(cells[6]).text().trim()) || null,
                metric6: parseFloat($(cells[7]).text().trim()) || null,
                matchup1: parseFloat($(cells[8]).text().trim()) || null,
                matchup2: parseFloat($(cells[9]).text().trim()) || null,
                finalProjection: parseFloat($(cells[10]).data('sortValue')) || null // Numeric sort value
            };

            projections.push(projection);
        });

        const filePath = path.resolve(__dirname, '../webscrap/projectionStdJSON.json');

        // Save the projections to a JSON file
        fs.writeFileSync(filePath, JSON.stringify(projections, null, 2), 'utf-8');
        console.log('Data saved to projectionStdJSON.json');
    } catch (error) {
        console.log('Error in scrapping Projection STD data, Error: ' + error.message);
    }
}

const url = 'https://www.fantasypros.com/nfl/projections/flex.php?scoring=STD'; // Replace with the actual URL
scrapeProjections(url);

// Repeat scraping every 6 hours
const sixHours = 6 * 60 * 60 * 1000;
setInterval(() => scrapeProjections(url), sixHours);
