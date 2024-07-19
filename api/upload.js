const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join('/tmp/uploads');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

module.exports = (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'File uploaded successfully!', file: req.file });
  });
};
