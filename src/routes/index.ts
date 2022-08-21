import express from 'express';
import images from './api/images';

const routes = express.Router();

routes.get('/', (req, res) => {
  res.send('Default API');
});

routes.use('/images', images);

export default routes;
