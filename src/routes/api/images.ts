import express from 'express';

const images = express.Router();

images.get('/', (req, res) => {
  res.send('Images API');
});

export default images;
