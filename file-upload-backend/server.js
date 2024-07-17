const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads')); // Specify upload directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Customize filename if needed
    }
});

const upload = multer({ storage: storage });

// POST endpoint to handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
    // Assuming 'file' is the name attribute of your file input
    const fileInfo = {
        name: req.file.originalname,
        size: req.file.size,
        date: new Date().toLocaleString() // Get current upload date/time
    };

    // Store fileInfo in a database or send it back as JSON response
    res.status(200).json(fileInfo);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
