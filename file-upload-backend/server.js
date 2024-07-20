// api/upload.js
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://www.syncshare.shop');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'POST') {
        // Handle file upload logic here
        res.status(200).json({ message: 'File uploaded successfully!' });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
