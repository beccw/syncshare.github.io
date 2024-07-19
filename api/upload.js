import { put } from '@vercel/blob';
import formidable from 'formidable';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: 'Error parsing the files' });
        return;
      }

      const file = files.file;
      const blobName = `${uuidv4()}-${file.originalFilename}`;
      const { url } = await put(blobName, file.filepath, { access: 'public' });

      try {
        res.status(200).json({ message: 'File uploaded successfully!', url });
      } catch (uploadError) {
        res.status(500).json({ error: 'Error uploading the file' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export const config = {
  api: {
    bodyParser: false, // Disabling body parsing to handle file uploads
  },
};
