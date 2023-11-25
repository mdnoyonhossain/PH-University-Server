import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHander from './app/middlwares/globalErrorHandler';
import router from './app/routes';
const app: Application = express();

// Parsers
app.use(express.json());
app.use(cors());

// application router
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
    res.send('Backend Server is Running');
});

// Global Error Handler
app.use(globalErrorHander);

export default app;
