import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHander from './app/middlewares/globalErrorHandler';
import router from './app/routes';
import notFound from './app/middlewares/notFound';
const app: Application = express();

// Parsers
app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173'] }));
app.use(cookieParser());

// application router
app.use('/api/v1', router);

app.get('/', async (req: Request, res: Response) => {
    res.send('Backend Server is Running');
});

// Global Error Handler
app.use(globalErrorHander);

// Not Found
app.use(notFound);

export default app;
