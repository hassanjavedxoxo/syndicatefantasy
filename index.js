// To access the values in .env file
require('dotenv').config();


// Packages
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;


// Importing routes
const redraftRankingRoute = require('./routes/redraftRankingRoute');
const dynastyRookieRankingRoute = require('./routes/dynastyRookieRankingRoute');
const dynastyRankingRoute = require('./routes/dynastyRankingRoute');
const postRoute = require('./routes/postRoute');
const webScrapRoute = require('./routes/webScrapRoute');
const tradeDatabaseRoute = require('./routes/tradeDatabaseRoute');


// Serve images statically
app.use('/uploads', express.static('uploads'));


// Middleware to parse JSON bodies
app.use(express.json());
// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));


// For calling api from other than our domail
app.use(cors());



// Using routes
app.use('/api/redraft-ranking', redraftRankingRoute);
app.use('/api/dynasty-rookie-ranking', dynastyRookieRankingRoute);
app.use('/api/dynasty-ranking', dynastyRankingRoute);
app.use('/api', postRoute);
app.use('/api/webscrap', webScrapRoute);
app.use('/api/database', tradeDatabaseRoute);

const connectDB = require('./config');
const chalk = require('chalk');


require('./webscrap/ktc');

// Run matchup scraping 1 min after ktc
setTimeout(() => {
    require('./webscrap/start&sit');
}, 60000);  // Delay of 1 minute

// Run projectionPpr scraping after 2 min
setTimeout(() => {
    require('./webscrap/projectionPpr');
}, 120000);  // Delay of 2 minutes

// Run projectionStd scraping after 3 min
setTimeout(() => {
    require('./webscrap/projectionStd');
}, 180000);  // Delay of 3 minutes

// Run projectionHalf scraping after 4 min
setTimeout(() => {
    require('./webscrap/projectionHalf');
}, 240000);  // Delay of 4 minutes

// Run pastProduction scraping after 5 min
setTimeout(() => {
    require('./webscrap/pastProduction');
}, 300000);  // Delay of 5 minutes

// Run bettingData scraping after 6 min
setTimeout(() => {
    require('./webscrap/bettingData');
}, 360000);  // Delay of 6 minutes

// Run dynastyProcess scraping after 7 min
setTimeout(() => {
    require('./webscrap/dynastyProcess');    
}, 420000); // Delay of 7 minutes

// Run SleeperPlayer API after 8 min
setTimeout(() => {
    require('./sleeperPlayers/getPlayers');  
}, 480000); // Delay of 8 minutes

// Run fantasyPros API after 9 min
setTimeout(() => {
    require('./webscrap/fantasyPros');
}, 540000); // Delay of 9 minutes

// Run OpponentRushingYard scrap after 10 min
setTimeout(() => {
    require('./webscrap/opponentRushigYard');
}, 600000); // Delay of 10 minutes


// Run OpponentPassingYard scrap after 10 min
setTimeout(() => {
    require('./webscrap/opponentPassingYard');
}, 660000); // Delay of 11 minutes


// Run OpponentPointsPerGame scrap after 10 min
setTimeout(() => {
    require('./webscrap/opponentPointsPerGame');
}, 720000); // Delay of 12 minutes






connectDB.then(() => {
    console.log(chalk.green.inverse('CONNECTED TO MONGODB'));
    app.listen(port, () => {
        console.log(chalk.green.inverse(`LISTENING TO PORT ${port}`));
    })
}).catch((err) => {
    console.log(chalk.red.inverse(`ERROR:- ${err}`));
})