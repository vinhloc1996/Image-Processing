import express, { application } from 'express';
import routes from './routes';

export const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('This is a main page');
});

app.use('/api', routes);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
