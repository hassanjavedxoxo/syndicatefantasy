const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');


router.get('/', (req, res) => {
    const playersFilePath = path.join(__dirname, '../sleeperPlayers/playersInfoJSON.json'); // Path to your JSON file

    fs.readFile(playersFilePath, 'utf8', (err, data) => {
        if (err) {
            // If there's an error reading the file, send a 500 response with the error
            return res.status(500).json({ error: 'Unable to read data from file', details: err });
        }

        // Send the JSON data as the response
        res.json(JSON.parse(data));
    });
})


module.exports = router;