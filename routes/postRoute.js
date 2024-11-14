const express = require('express');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');
const blogModel = require('../models/blogModel');
const youtubePostModel = require('../models/youtubePostModel');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';

        // Check if 'uploads' directory exists, if not, create it
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'));
        }
    }
});


// Create a new blog post with an image
router.post('/blogs', upload.single('image'), async (req, res) => {
    try {
        const { heading, data } = req.body;

        const newBlog = new blogModel({
            heading,
            data,
            image: req.file ? `/uploads/${req.file.filename}` : null // Save image path
        });

        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});


router.get('/blogs', async (req, res) => {
    try {
        const blogs = await blogModel.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




router.post('/youtube', async (req, res) => {
    const { heading, videoLink } = req.body;

    try {
        // Check if both heading and videoLink are provided
        if (!heading || !videoLink) {
            return res.status(400).json({ message: 'Please provide all the required data (heading, videoLink)' });
        }

        // Create a new youtube post entry using the data from req.body
        const newYoutubePost = new youtubePostModel({
            heading,
            videoLink
        });

        // Save the new post to the database
        await newYoutubePost.save();

        // Respond with the newly created post
        res.status(201).json(newYoutubePost); // Returning the correct object (newYoutubePost)
    } catch (error) {
        // If there is an error, send the error message as a response
        res.status(400).json({ message: error.message });
    }
});


router.get('/youtube', async (req, res) => {
    try {
        const youtubePost = await youtubePostModel.find();
        res.status(200).json(youtubePost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.delete('/youtube/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the URL params

        // Find and delete the youtube post by ID
        const deletedPost = await youtubePostModel.findByIdAndDelete(id);

        // If no post found with that ID
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Send a success response with the deleted post details
        res.status(200).json({ message: 'Post deleted successfully', deletedPost });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.delete('/blogs/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the URL params

        // Find and delete the youtube post by ID
        const deletedBlog = await blogModel.findByIdAndDelete(id);

        // If no post found with that ID
        if (!deletedBlog) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Send a success response with the deleted post details
        res.status(200).json({ message: 'Post deleted successfully', deletedBlog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




module.exports = router;