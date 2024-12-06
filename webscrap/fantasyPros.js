const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function scrapeData() {
    try {
        // Fetch the HTML content of the page
        const { data: html } = await axios.get('https://www.fantasypros.com/nfl/points-allowed.php', { timeout: 120000 });

        // Load the HTML into Cheerio
        const $ = cheerio.load(html);

        // Select all table rows
        const rows = $('table tr');

        const results = [];

        rows.each((index, row) => {
            const cells = $(row).find('td');

            // Only process rows that contain data (skip rows without <td>)
            if (cells.length > 0) {
                results.push({
                    team: $(cells[0]).text().trim(),
                    column1: $(cells[1]).text().trim(),
                    column2: $(cells[2]).text().trim(),
                    column3: $(cells[3]).text().trim(),
                    column4: $(cells[4]).text().trim(),
                    column5: $(cells[5]).text().trim(),
                    column6: $(cells[6]).text().trim(),
                    column7: $(cells[7]).text().trim(),
                    column8: $(cells[8]).text().trim(),
                    column9: $(cells[9]).text().trim(),
                    column10: $(cells[10]).text().trim(),
                    column11: $(cells[11]).text().trim(),
                    column12: $(cells[12]).text().trim(),
                });
            }
        });

        // Write data to a JSON file
        const filePath = path.resolve(__dirname, '../webscrap/fantasyProsJSON.json');
        fs.writeFileSync(filePath, JSON.stringify(results, null, 2), 'utf-8');

        console.log('Data saved to fantasyProsJSON.json');
    } catch (error) {
        console.error('Error occurred:', error.message);
    }
}

// Scrape immediately and then repeat every 36 hours
const thirtySixHours = 36 * 60 * 60 * 1000;

setInterval(() => {
    scrapeData();
}, thirtySixHours);

scrapeData();
