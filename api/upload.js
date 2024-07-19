export default async function handler(req, res) {
    if (req.method === 'POST') {
      // Handle file upload logic here
      res.status(200).json({ message: 'File uploaded successfully!' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }
  