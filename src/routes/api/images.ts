import express from 'express';
import { Image } from '../../models/Image';
import imageProcessing from '../../processor';
import { OutputFormat } from '../../models/Output';
const images = express.Router();

images.get('/', (req, res) => {
  //convert query data as our model
  const { filename, height, width } = req.query as unknown as {
    filename: string;
    height: number;
    width: number;
  };
  const image: Image = {
    filename,
    height: +height,
    width: +width,
  };

  imageProcessing(image)
    .then((data: OutputFormat) => {
      if (data.isSuccess) {
        if (data.filePath) {
          res.sendFile(data.filePath);
        }
      }
    })
    .catch((err: OutputFormat) => {
      res.send(err.error);
    });
});

export default images;
