const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();

router.get('/all', async (req, res) => {
    try {
        // Getting data from external source (FantasyCalc)
        const response = await axios.get('https://api.fantasycalc.com/values/current?isDynasty=true&numQbs=1&numTeams=8&ppr=1&includeAdp=false');
        
        // Extract only the desired fields for each player
        const players = response.data
        .map(item => ({
            id: item.player.id,
            rank: item.overallRank,
            name: item.player.name,
            position: item.player.position,
            maybeAge: item.player.maybeAge,
            value: item.value,
            maybeYoe: item.player.maybeYoe,
            team: item.player.maybeTeam
        }));

        res.status(200).json(players); // Send the filtered list of players
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while fetching data');
    }
});


router.get('/superflex', async (req, res) => {
    try {
        // Getting data from external source (FantasyCalc)
        const response = await axios.get('https://api.fantasycalc.com/values/current?isDynasty=true&numQbs=2&numTeams=8&ppr=1&includeAdp=false');

        // Extract only the desired fields for each player
        const players = response.data
            .map(item => ({
                id: item.player.id,
                rank: item.overallRank,
                name: item.player.name,
                position: item.player.position,
                maybeAge: item.player.maybeAge,
                superflexValue: item.value,
                maybeYoe: item.player.maybeYoe,
                team: item.player.maybeTeam
            }));

        res.status(200).json(players); // Send the filtered list of players
    } catch (err) {
        // console.error(err);
        res.status(500).send('An error occurred while fetching data');
    }
});

module.exports = router;
