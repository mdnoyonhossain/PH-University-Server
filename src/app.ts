import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { StudentRoutes } from './app/modules/student/student.route';
const app: Application = express();

// Parsers
app.use(express.json());
app.use(cors());

// application router
app.use('/api/v1/students', StudentRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Backend Server is Running');
});


export default app;
