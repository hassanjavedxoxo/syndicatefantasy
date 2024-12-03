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

require('./webscrap/ktc');

// Run matchup scraping 3 min after ktc
setTimeout(() => {
    require('./webscrap/start&sit');
}, 180000);  // Delay of 3 minutes

// Run projectionPpr scraping after 6 min
setTimeout(() => {
    require('./webscrap/projectionPpr');
}, 360000);  // Delay of 6 minutes

// Run projectionStd scraping after 9 min
setTimeout(() => {
    require('./webscrap/projectionStd');
}, 540000);  // Delay of 9 minutes

// Run projectionHalf scraping after 12 min
setTimeout(() => {
    require('./webscrap/projectionHalf');
}, 720000);  // Delay of 12 minutes

// Run pastProduction scraping after 15 min
setTimeout(() => {
    require('./webscrap/pastProduction');
}, 900000);  // Delay of 15 minutes

// Run bettingData scraping after 18 min
setTimeout(() => {
    require('./webscrap/bettingData');
}, 1080000);  // Delay of 18 minutes

// Run dynastyProcess scraping after 21 min
setTimeout(() => {
    require('./webscrap/dynastyProcess');    
}, 1260000); // Delay of 21 minutes

// Run SleeperPlayer API after 24 min
setTimeout(() => {
    require('./sleeperPlayers/getPlayers');  
}, 1440000); // Delay of 24 minutes

// Run fantasyPros API after 27 min
setTimeout(() => {
    require('./webscrap/fantasyPros');
}, 1620000); // Delay of 27 minutes

// Run OpponentRushingYard scrap after 30 min
setTimeout(() => {
    require('./webscrap/opponentRushigYard');
}, 1800000); // Delay of 30 minutes

// Run OpponentPassingYard scrap after 33 min
setTimeout(() => {
    require('./webscrap/opponentPassingYard');
}, 1980000); // Delay of 33 minutes

// Run OpponentPointsPerGame scrap after 36 min
setTimeout(() => {
    require('./webscrap/opponentPointsPerGame');
}, 2160000); // Delay of 36 minutes

connectDB.then(() => {
    console.log(chalk.green.inverse('CONNECTED TO MONGODB'));
    app.listen(port, () => {
        console.log(chalk.green.inverse(`LISTENING TO PORT ${port}`));
    })
}).catch((err) => {
    console.log(chalk.red.inverse(`ERROR:- ${err}`));
})
