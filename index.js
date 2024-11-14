// To access the values in .env file
require('dotenv').config();


// Packages
const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;


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

// Run matchup scraping 1 min hour after ktc
setTimeout(() => {
    require('./webscrap/start&sit');
}, 60000);  // Delay of 1 minute

// Run projectionPpr scraping 2 min after ktc
setTimeout(() => {
    require('./webscrap/projectionPpr');
}, 120000);  // Delay of 2 minutes

// Run projectionStd scraping 3 min after ktc
setTimeout(() => {
    require('./webscrap/projectionStd');
}, 180000);  // Delay of 3 minutes

// Run projectionHalf scraping 4 min after ktc
setTimeout(() => {
    require('./webscrap/projectionHalf');
}, 240000);  // Delay of 4 minutes

// Run pastProduction scraping 5 min after ktc
setTimeout(() => {
    require('./webscrap/pastProduction');
}, 300000);  // Delay of 5 minutes

// Run bettingData scraping 5 min after ktc
setTimeout(() => {
    require('./webscrap/bettingData');
}, 360000);  // Delay of 6 minutes


connectDB.then(() => {
    console.log(chalk.green.inverse('CONNECTED TO MONGODB'));
    app.listen(port, () => {
        console.log(chalk.green.inverse(`LISTENING TO PORT ${port}`));
    })
}).catch((err) => {
    console.log(chalk.red.inverse(`ERROR:- ${err}`));
})