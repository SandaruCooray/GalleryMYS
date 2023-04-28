import express from 'express';
import {
  readdir,
  statSync,
  readFileSync
} from 'fs';
import {
  join,
  basename
} from 'path';
import mime from 'mime';


import path from "path";
import {
  fileURLToPath
} from "url";

import {
  Blob
} from 'buffer';



const __filename = fileURLToPath(
  import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();



app.get('/images', (req, res) => {

  const collectiondata = req.query.collection;

  console.log(' client requesting collection --> ', collectiondata);
  console.log('')


  const IMAGES_DIR = join(__dirname, `images/${collectiondata}`);

  readdir(IMAGES_DIR, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
      return;
    }


  //  return res.json('hy');

    const images = files.filter(file => {
      const filePath = join(IMAGES_DIR, file);
      const fileStat = statSync(filePath);
      return fileStat.isFile() && mime.getType(filePath).startsWith('image/');
    });



    const imagePaths = images.map(image => join(IMAGES_DIR, image));

    // console.log(imagePaths);

    const imageData = imagePaths.map(imagePath => {
      try {
        const data = readFileSync(imagePath, {
          encoding: 'base64'
        });
        return {
          id: basename(imagePath.replace(/\.[^/.]+$/, '')),
          image: data
        };
      } catch (error) {
        console.error(`Error reading file ${imagePath}:`, error);
        return null;
      }
    }).filter(image => image !== null);



   // console.log(imageData)

    res.json(imageData);
  });
});

app.listen(5000, () => {
  console.log('Server listening on port 5000');
});