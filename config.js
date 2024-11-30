const { default: mongoose } = require("mongoose");

const connnectDB = mongoose.connect(`mongodb+srv://areesshah430:${process.env.MONGODB_USER_KEY}@cluster0.2hmiy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);

module.exports = connnectDB;