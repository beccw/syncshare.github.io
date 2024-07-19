// server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Set up middleware
app.use(cors());
app.use(express.static('public'));

// Configure multer for file uploads
const upload = multer({
    dest: 'uploads/', // Destination for uploaded files
    limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
});

// Create uploads directory if not exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ filePath: `/uploads/${req.file.filename}` });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
