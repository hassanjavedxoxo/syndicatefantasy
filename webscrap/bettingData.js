const puppeteer = require('puppeteer');
const fs = require('fs');  // Required for writing to files
const path = require('path');

async function scrapeOdds() {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://actionnetwork.com/odds');  // Replace with the actual website URL

    // Wait for the team icons to be available
    await page.waitForSelector('.game-info__team-icon', { timeout: 120000 });

    const oddsData = await page.evaluate(() => {
      // Select all relevant tr elements (each table row)
      const rows = document.querySelectorAll('tr');

      const oddsArray = Array.from(rows).map(row => {
        // Select all the divs that contain odds and associated data
        const oddsDivs = row.querySelectorAll('div[data-testid="book-cell__odds"]');

        // If there are no relevant divs in the row, skip it
        if (oddsDivs.length === 0) return null;

        const rowData = {};

        // Loop over each book odds div and extract the necessary data
        oddsDivs.forEach((div, index) => {
          // Extract spread and line values from the span elements
          const spreadElement = div.querySelector('.css-1qynun2');
          const lineElement = div.querySelector('.book-cell__secondary');
          const logoElement = div.querySelector('span img');

          const spread = spreadElement ? spreadElement.textContent.trim() : null;
          const line = lineElement ? lineElement.textContent.trim() : null;
          const logo = logoElement ? logoElement.getAttribute('src') : null;

          // Use 'one', 'two', etc. for key names, based on the index
          if (index === 0) {
            rowData.one = { spread, line, logo };
          } else if (index === 1) {
            rowData.two = { spread, line, logo };
          } else if (index === 2) {
            rowData.three = { spread, line, logo };
          } else if (index === 3) {
            rowData.four = { spread, line, logo };
          } else if (index === 4) {
            rowData.five = { spread, line, logo };
          } else if (index === 5) {
            rowData.six = { spread, line, logo };
          } else if (index === 6) {
            rowData.seven = { spread, line, logo };
          } else if (index === 7) {
            rowData.eight = { spread, line, logo };
          } else if (index === 8) {
            rowData.nine = { spread, line, logo };
          } else if (index === 9) {
            rowData.ten = { spread, line, logo };
          } else if (index === 10) {
            rowData.eleven = { spread, line, logo };
          } else if (index === 11) {
            rowData.twelve = { spread, line, logo };
          } else if (index === 12) {
            rowData.thirteen = { spread, line, logo };
          } else if (index === 13) {
            rowData.fourteen = { spread, line, logo };
          } else if (index === 14) {
            rowData.fifteen = { spread, line, logo };
          } else if (index === 15) {
            rowData.sixteen = { spread, line, logo };
          }
        });

        // Extract team names from the <div class="game-info__team--desktop"> elements
        const teamElements = row.querySelectorAll('.game-info__team--desktop span');
        const teamName1 = teamElements.length > 0 ? teamElements[0].textContent.trim() : null;
        const teamName2 = teamElements.length > 1 ? teamElements[1].textContent.trim() : null;

        // Extract team icons (images) from the nested div structure
        const teamIconElements = row.querySelectorAll('.game-info__placeholder img');
        const teamIcon1 = teamIconElements.length > 0 ? teamIconElements[0].getAttribute('src') : null;
        const teamIcon2 = teamIconElements.length > 1 ? teamIconElements[1].getAttribute('src') : null;

        // Extract "OPEN" values from the <div class="best-odds__open-cell"> elements
        const openElements = row.querySelectorAll('.best-odds__open-cell');
        const openSpread1 = openElements.length > 0 ? openElements[0].querySelector('div').textContent.trim() : null;
        const openLine1 = openElements.length > 0 ? openElements[0].querySelector('.best-odds__open-cell-secondary div').textContent.trim() : null;
        const openSpread2 = openElements.length > 1 ? openElements[1].querySelector('div').textContent.trim() : null;
        const openLine2 = openElements.length > 1 ? openElements[1].querySelector('.best-odds__open-cell-secondary div').textContent.trim() : null;

        return {
          rowData, // The spread, line, and logo data with keys like 'one', 'two', etc.
          teamName1,
          teamName2,
          teamIcon1,
          teamIcon2,
          openSpread1,
          openLine1,
          openSpread2,
          openLine2
        };
      }).filter(row => row !== null);  // Filter out null rows

      return oddsArray;
    });

    const filePath = path.resolve(__dirname, '../webscrap/bettingDataJSON.json');
    // Write the data to a JSON file
    fs.writeFileSync(filePath, JSON.stringify(oddsData, null, 2));

    console.log('Data saved to bettingDataJSON.json');

    await browser.close();
  } catch (error) {
    console.log('Error occured while scraping Betting Data, Error: ' + error);
  }
}

const threeHours = 3 * 60 * 60 * 1000;

setInterval(() => {
  scrapeOdds();
}, threeHours);

scrapeOdds();
