import express from 'express';
import routes from './routes';

export const app = express();
const port = 3000;

app.get('/', (req: express.Request, res: express.Response): void => {
  res.send('This is a main page');
});

app.use('/api', routes);

app.listen(port, (): void => {
  console.log(`server started at http://localhost:${port}`);
});
