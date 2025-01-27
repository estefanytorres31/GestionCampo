import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';

//Rutas
import rolRouter from './routes/RolRoute.js';


const app = express();


app.use(cors());
app.use(json());
app.use(morgan('dev'));

// Routes
app.use(rolRouter);

export default app;
