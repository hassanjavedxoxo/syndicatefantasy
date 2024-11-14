const { default: mongoose } = require("mongoose");

const connnectDB = mongoose.connect(`mongodb+srv://hassanjavedwork:${process.env.MONGODB_USER_KEY}@cluster0.m5usp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);

module.exports = connnectDB;