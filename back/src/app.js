import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';

//Rutas
import rolRouter from './routes/RolRoute.js';
import usuarioRouter from './routes/UsuarioRoute.js';
import authRouter from './routes/AuthRoute.js';

const app = express();


app.use(cors());
app.use(json());
app.use(morgan('dev'));

// Routes
app.use(rolRouter);
app.use(usuarioRouter);
app.use(authRouter);

export default app;
