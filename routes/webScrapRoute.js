const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/ktc', async (req, res) => {
    const filePath = path.join(__dirname, '../webscrap/ktcJSON.json'); // Path to your JSON file

    // Read the file asynchronously
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            // If there's an error reading the file, send a 500 response with the error
            return res.status(500).json({ error: 'Unable to read data from file', details: err });
        }

        // Send the JSON data as the response
        res.json(JSON.parse(data));
    });
})



router.get('/start&sit', async (req, res) => {
    const filePath = path.join(__dirname, '../webscrap/start&sitJSON.json'); // Path to your JSON file

    // Read the file asynchronously
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            // If there's an error reading the file, send a 500 response with the error
            return res.status(500).json({ error: 'Unable to read data from file', details: err });
        }

        // Send the JSON data as the response
        res.json(JSON.parse(data));
    });
})

router.get('/projection/:category', async (req, res) => {
    const { category } = req.params;
    let filePath;

    // Determine the file path based on the category
    if(category === 'PPR') {
        filePath = path.join(__dirname, '../webscrap/projectionPprJSON.json');
    } else if(category === 'HALF') {
        filePath = path.join(__dirname, '../webscrap/projectionHalfJSON.json');
    } else if(category === 'STD') {
        filePath = path.join(__dirname, '../webscrap/projectionStdJSON.json');
    } else {
        // Invalid category, return error response immediately
        return res.status(400).json({ message: 'Invalid category. Please use one of: PPR, HALF, STD.' });
    }

    // Read the file asynchronously
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            // If there's an error reading the file, send a 500 response with the error
            return res.status(500).json({ error: 'Unable to read data from file', details: err });
        }

        try {
            // Try to parse the JSON data
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (parseError) {
            // If JSON parsing fails, return a 500 error
            return res.status(500).json({ error: 'Error parsing JSON data', details: parseError });
        }
    });
});



router.get('/pastproduction', async (req, res) => {
    const filePath = path.join(__dirname, '../webscrap/pastProductionJSON.json'); // Path to your JSON file

    // Read the file asynchronously
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            // If there's an error reading the file, send a 500 response with the error
            return res.status(500).json({ error: 'Unable to read data from file', details: err });
        }

        // Send the JSON data as the response
        res.json(JSON.parse(data));
    });
})


router.get('/betting', async (req, res) => {
    const filePath = path.join(__dirname, '../webscrap/bettingDataJSON.json'); // Path to your JSON file

    // Read the file asynchronously
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            // If there's an error reading the file, send a 500 response with the error
            return res.status(500).json({ error: 'Unable to read data from file', details: err });
        }

        // Send the JSON data as the response
        res.json(JSON.parse(data));
    });
})



router.get('/dynastyprocess', async (req, res) => {
    const filePath = path.join(__dirname, '../webscrap/dynastyProcessJSON.json'); // Path to your JSON file

    // Read the file asynchronously
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            // If there's an error reading the file, send a 500 response with the error
            return res.status(500).json({ error: 'Unable to read data from file', details: err });
        }

        // Send the JSON data as the response
        res.json(JSON.parse(data));
    });
})


module.exports = router