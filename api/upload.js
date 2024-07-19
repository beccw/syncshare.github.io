import multer from 'multer';
import nextConnect from 'next-connect';
import path from 'path';
import fs from 'fs';

// Set up multer
const upload = multer({
    dest: 'public/uploads/', // Store uploads in the 'public/uploads' directory
    limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
});

// Create uploads directory if not exists
if (!fs.existsSync('public/uploads')) {
    fs.mkdirSync('public/uploads');
}

// Create handler with nextConnect
const handler = nextConnect();

// Apply middleware
handler.use(upload.single('file'));

// Handle POST request
handler.post((req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.status(200).json({ filePath: `/uploads/${req.file.filename}` });
});

export default handler;