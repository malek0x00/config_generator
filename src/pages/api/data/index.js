import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const dirPath = path.join(process.cwd(), 'public/data');

  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    const data = [];

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      data.push({ name: file, content: fileContent });
    });

    res.status(200).json(data);
  });
}