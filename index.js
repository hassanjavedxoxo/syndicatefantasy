// To access the values in .env file
require('dotenv').config();

// Packages
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const chalk = require('chalk');
const path = require('path');

// Importing routes
const redraftRankingRoute = require('./routes/redraftRankingRoute');
const dynastyRookieRankingRoute = require('./routes/dynastyRookieRankingRoute');
const dynastyRankingRoute = require('./routes/dynastyRankingRoute');
const postRoute = require('./routes/postRoute');
const webScrapRoute = require('./routes/webScrapRoute');
const tradeDatabaseRoute = require('./routes/tradeDatabaseRoute');
const sleeperPlayersRoute = require('./routes/sleeperPlayerRoute');

// Serve images statically
app.use('/uploads', express.static('uploads'));
app.use('/', express.static(path.join(__dirname, 'build')));

// Middleware to parse JSON bodies
app.use(express.json());
// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// For calling api from other than our domain
app.use(cors());

// Using routes
app.use('/api/redraft-ranking', redraftRankingRoute);
app.use('/api/dynasty-rookie-ranking', dynastyRookieRankingRoute);
app.use('/api/dynasty-ranking', dynastyRankingRoute);
app.use('/api', postRoute);
app.use('/api/webscrap', webScrapRoute);
app.use('/api/database', tradeDatabaseRoute);
app.use('/api/sleeperPlayers', sleeperPlayersRoute);

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

// Config File
const connectDB = require('./config');

// Define a function to run the scraping tasks in sequence with a delay of 2 minutes between each
function runScrapingTasks() {
    // Task 1: Run projectionPpr scraping
    setTimeout(() => {
        require('./webscrap/projectionPpr');
    }, 0);  // No delay for the first task

    // Task 2: Run projectionStd scraping after 2 minutes (2 * 60 * 1000 ms)
    setTimeout(() => {
        require('./webscrap/projectionStd');
    }, 2 * 60 * 1000);  // 2 minutes delay

    // Task 3: Run projectionHalf scraping after 4 minutes (2 * 2 * 60 * 1000 ms)
    setTimeout(() => {
        require('./webscrap/projectionHalf');
    }, 4 * 60 * 1000);  // 4 minutes delay

    // Task 4: Run pastProduction scraping after 6 minutes (3 * 2 * 60 * 1000 ms)
    setTimeout(() => {
        require('./webscrap/pastProduction');
    }, 6 * 60 * 1000);  // 6 minutes delay

    // Task 5: Run bettingData scraping after 8 minutes (4 * 2 * 60 * 1000 ms)
    setTimeout(() => {
        require('./webscrap/bettingData');
    }, 8 * 60 * 1000);  // 8 minutes delay

    // Task 6: Run dynastyProcess scraping after 10 minutes (5 * 2 * 60 * 1000 ms)
    setTimeout(() => {
        require('./webscrap/dynastyProcess');
    }, 10 * 60 * 1000);  // 10 minutes delay

    // Task 7: Run SleeperPlayer API after 12 minutes (6 * 2 * 60 * 1000 ms)
    setTimeout(() => {
        require('./sleeperPlayers/getPlayers');
    }, 12 * 60 * 1000);  // 12 minutes delay

    // Task 8: Run fantasyPros API after 14 minutes (7 * 2 * 60 * 1000 ms)
    setTimeout(() => {
        require('./webscrap/fantasyPros');
    }, 14 * 60 * 1000);  // 14 minutes delay

    // Task 9: Run OpponentRushingYard scraping after 16 minutes (8 * 2 * 60 * 1000 ms)
    setTimeout(() => {
        require('./webscrap/opponentRushigYard');
    }, 16 * 60 * 1000);  // 16 minutes delay

    // Task 10: Run OpponentPassingYard scraping after 18 minutes (9 * 2 * 60 * 1000 ms)
    setTimeout(() => {
        require('./webscrap/opponentPassingYard');
    }, 18 * 60 * 1000);  // 18 minutes delay

    // Task 11: Run OpponentPointsPerGame scraping after 20 minutes (10 * 2 * 60 * 1000 ms)
    setTimeout(() => {
        require('./webscrap/opponentPointsPerGame');
    }, 20 * 60 * 1000);  // 20 minutes delay

    // Task 12: Run OpponentPointsPerGame scraping after 22 minutes (11 * 2 * 60 * 1000 ms)
    setTimeout(() => {
        require('./webscrap/ktc');
    }, 22 * 60 * 1000);  // 22 minutes delay
}

// Run the scraping tasks when the server starts
runScrapingTasks();

// Connect to DB and start server
connectDB.then(() => {
    console.log(chalk.green.inverse('CONNECTED TO MONGODB'));
    app.listen(port, () => {
        console.log(chalk.green.inverse(`LISTENING TO PORT ${port}`));
    })
}).catch((err) => {
    console.log(chalk.red.inverse(`ERROR:- ${err}`));
});
