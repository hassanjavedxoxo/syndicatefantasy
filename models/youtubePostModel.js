const { default: mongoose } = require("mongoose");

const youtubePostSchema = mongoose.Schema({
    heading: {
        type: String
    },
    videoLink: {
        type: String
    }
}, { timestamps: true });


const youtubePostModel = mongoose.model('youtube', youtubePostSchema);

module.exports = youtubePostModel;