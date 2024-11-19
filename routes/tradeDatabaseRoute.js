const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();

router.post('/get', async (req, res) => {
    const { side1, side2, category } = req.body;
    if(!category) {
        return res.status(400).json({ message: 'category' });
    }
    if (!side1) {
        return res.status(400).json({ message: 'side1 is not provided' });
    }

    let side1Data = '';
    let side2Data = '';

    // Construct `side1` query parameters
    side1.forEach((value) => {
        side1Data += `&side1=${value}`;
    });

    if (!side2) {
        let isDynasty = true;
        if(category === 'dynasty') {
            isDynasty = true;
        } else if (category === 'redraft') {
            isDynasty = false;
        } else {
            return res.status(400).json({ message: 'unknown category' });
        }
        // If `side2` is not provided, call API with only `side1` data
        const apiForSide1 = `https://api.fantasycalc.com/trades?isDynasty=${isDynasty}&numTeams=8&numTeams=10&numTeams=12&numTeams=14&ppr=0&ppr=.5&ppr=1&numQbs=1&numQbs=2${side1Data}&minPlayers=2&maxPlayers=8`;

        axios.get(apiForSide1)
            .then((response) => {
                let trades = response.data.map((item) => ({
                    date: item.date,
                    side1: item.side1,
                    side2: item.side2,
                    qb: item.numQbs,
                    ppr: item.ppr,
                    tm: item.numTeams,
                    tep: item.tePremium,
                    start: item.numStarters
                }))
                res.status(200).json(trades);
            })
            .catch((err) => {
                console.error(err); // This will print any error message
                res.status(500).json({ error: err.message });
            });

    } else {
        let isDynasty = true;
        if(category === 'dynasty') {
            isDynasty = true;
        } else if (category === 'redraft') {
            isDynasty = false;
        } else {
            return res.status(400).json({ message: 'unknown category' });
        }
        // Construct `side2` query parameters
        side2.forEach((value) => {
            side2Data += `&side2=${value}`;
        });

        // Call API with both `side1` and `side2` data
        const apiForBothSides = `https://api.fantasycalc.com/trades?isDynasty=${isDynasty}&numTeams=8&numTeams=10&numTeams=12&numTeams=14&ppr=0&ppr=.5&ppr=1&numQbs=1&numQbs=2${side1Data}${side2Data}&minPlayers=2&maxPlayers=8`;

        axios.get(apiForBothSides)
            .then((response) => {
                let trades = response.data.map((item) => ({
                    date: item.date,
                    side1: item.side1,
                    side2: item.side2,
                    qb: item.numQbs,
                    ppr: item.ppr,
                    tm: response.data.numTeams,
                    tep: item.tePremium,
                    start: item.numStarters
                }))
                
                res.status(200).json(trades);
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }
});



module.exports = router;