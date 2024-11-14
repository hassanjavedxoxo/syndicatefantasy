const { default: mongoose } = require("mongoose");

const blogSchema = mongoose.Schema({
    heading: {
        type: String
    },
    data: {
        type: [String]
    },
    image: {
        type: String
    }
}, { timestamps: true });


const blogModel = mongoose.model('blog', blogSchema);

module.exports = blogModel;