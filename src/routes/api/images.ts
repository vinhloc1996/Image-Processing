import express from 'express';
import sharp, { OutputInfo } from 'sharp';
import { Image } from '../../models/Image';
import * as fs from 'fs';
import { SYSTEM_FULL_PATH, SYSTEM_THUMB_PATH } from '../../constant';
import imageProcessing from '../../processor';

const images = express.Router();

images.get('/', (req, res) => {
  //convert query data as our modal
  const image = req.query as unknown as Image;

  const result = imageProcessing(image);

  if (result.isSuccess) {
    if (result.filePath) res.sendFile(result.filePath);
  } else {
    res.send(result.error);
  }
});

export default images;
