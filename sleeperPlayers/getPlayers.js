const axios = require('axios');
const fs = require('fs');
const path = require('path');

const getFilteredPlayers = async () => {
    try {
        // Fetch player data
        const playerResponse = await axios.get('https://api.sleeper.app/v1/players/nfl');
        const players = Object.values(playerResponse.data).filter(player => 
            player.team && 
            player.age && 
            (player.position === 'QB' || player.position === 'RB' || player.position === 'WR' || player.position === 'TE' || player.position === 'K')
          );
          

        // Fetch team data (stored as an object)
        const teamResponse = await axios.get('https://api.sleeper.app/v1/players/nfl'); // Updated to fetch team data separately
        const teams = teamResponse.data;

        // Transform player data
        const transformedPlayers = players.map(player => {
            const teamKey = player.team; // Player's team code (e.g., "BAL")
            const matchedTeam = teams[teamKey]; // Find team by key

            // Handle case where matchedTeam might be undefined
            const teamFullName = matchedTeam ? `${matchedTeam.first_name} ${matchedTeam.last_name}` : null;

            // Handle the `findOnTeamRankingWebsite` value
            const findOnTeamRankingWebsite = player.team
                ? (player.team === 'LAR' ? 'la rams'
                    : player.team === 'LAC' ? 'la chargers'
                        : player.team === 'NYG' ? 'ny giants'
                            : player.team === 'NYJ' ? 'ny jets'
                                : matchedTeam ? matchedTeam.first_name.toLowerCase() : null)
                : null;

            return {
                name: player.full_name,
                age: player.age,
                height: player.height,
                birth_date: player.birth_date,
                team: player.team,
                team_full_name: teamFullName,
                position: player.position,
                playerId: player.player_id,
                findOnTeamRankingWebsite: findOnTeamRankingWebsite
            };
        });

        // Save the filtered and transformed data to a JSON file
        const filePath = path.resolve(__dirname, 'playersInfoJSON.json');
        fs.writeFileSync(filePath, JSON.stringify(transformedPlayers, null, 2), 'utf8');

        console.log('Data saved to playersInfoJSON.json');
    } catch (error) {
        console.error('Error occurred:', error.message);
    }
};

const thirtySevenHours = 37 * 60 * 60 * 1000;

setInterval(() => {
    getFilteredPlayers();
}, thirtySevenHours);


getFilteredPlayers();
