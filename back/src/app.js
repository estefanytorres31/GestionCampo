import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();


app.use(cors());
app.use(json());
app.use(morgan('dev'));

export default app;
