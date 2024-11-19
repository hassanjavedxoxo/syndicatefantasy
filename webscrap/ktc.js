const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function scrapeKTC() {
  const URL = 'https://keeptradecut.com/dynasty-rankings?page=0&filters=QB|WR|RB|TE|RDP&format=1'; // Start from page 0
  const allElements = [];
  const players = [];

  // Scrape pages starting from page 0
  for (let page = 0; page <= 9; page++) {  // Looping from page 0 to 9
    const response = await axios.get(URL.replace('page=0', `page=${page}`));
    const $ = cheerio.load(response.data); // Load HTML with cheerio

    const playerElements = $('.onePlayer');

    playerElements.each((i, playerElement) => {
      const playerNameWithTeam = $(playerElement).find('.player-name').text().trim();

      if (playerNameWithTeam) {
        // Split the player name from the team abbreviation
        const playerName = playerNameWithTeam.replace(/[A-Z]{3}$/, '').trim(); // Remove 3-letter team code from the end
        const teamAbbreviation = playerNameWithTeam.replace(playerName, '').trim(); // Extract the team code

        allElements.push(playerElement);

        // Extract other player data as usual
        const playerPositionRank = $(playerElement).find('.position').text().trim();
        const playerValue = $(playerElement).find('.value').text().trim();
        const playerAgeText = $(playerElement).find('.position.hidden-xs').text().trim();
        const playerAge = playerAgeText ? parseFloat(playerAgeText.slice(0, 4)) : 0;
        const playerPosition = playerPositionRank.slice(0, 2);  // Extract the position

        const playerData = {
          'name': playerName,
          'team': teamAbbreviation, // Add team abbreviation
          'positionRank': playerPositionRank,
          'position': playerPosition,
          'value': parseInt(playerValue),
          'age': playerAge,
          'superflexValue': 0, // Default value, will be updated below
        };

        if (playerName) {
          players.push(playerData);
        }
      }
    });
  }

  return players;
}

async function scrapeSuperflexData(players) {
  const URL = 'https://keeptradecut.com/dynasty-rankings?page=0&filters=QB|WR|RB|TE|RDP&format=2'; // Superflex URL

  for (let page = 0; page <= 9; page++) {  // Looping from page 0 to 9
    const response = await axios.get(URL.replace('page=0', `page=${page}`));
    const $ = cheerio.load(response.data); // Ensure cheerio.load() is called here to initialize $

    const playerElements = $('.onePlayer');

    playerElements.each((i, playerElement) => {
      const playerNameWithTeam = $(playerElement).find('.player-name').text().trim();
      const playerValue = $(playerElement).find('.value').text().trim();

      // Split the player name from the team abbreviation
      const playerName = playerNameWithTeam.replace(/[A-Z]{3}$/, '').trim(); // Remove 3-letter team code from the end
      const teamAbbreviation = playerNameWithTeam.replace(playerName, '').trim(); // Extract the team code

      players.forEach(player => {
        if (player['name'] === playerName && player['team'] === teamAbbreviation) {
          player['superflexValue'] = parseInt(playerValue); // Set SFValue
        }
      });
    });
  }

  return players;
}

async function main() {
  try {
    let players = await scrapeKTC();
    players = await scrapeSuperflexData(players);

    const filePath = path.resolve(__dirname, '../webscrap/ktcJSON.json');
    // Write the players data to ktcJSON.json
    fs.writeFile(filePath, JSON.stringify(players, null, 2), (err) => {
      if (err) {
        console.error('Error writing to file', err);
      } else {
        console.log('Data saved to ktcJSON.json');
      }
    });
  } catch (error) {
    console.log('Error occured while scraping KeepTradeCut Data, Error: ' + error);
  }

}

const tenHours = 10 * 60 * 60 * 1000;


main();

setInterval(main, tenHours);