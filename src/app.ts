import express, { Request, Response } from 'express';
import cors from 'cors';

import geminiRouter from './routes/gemini';
import imageUtilsRouter from './routes/imageUtils';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.options('*', cors());

app.use(express.json());

app.use('/api/gemini', geminiRouter);
app.use('/api/image', imageUtilsRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('API de asistencia-dos funcionando');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});