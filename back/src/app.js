import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';

//Rutas
import rolRouter from './routes/RolRoute.js';
import usuarioRouter from './routes/UsuarioRoute.js';
import authRouter from './routes/AuthRoute.js';
import sistemaRouter from './routes/SistemaRoute.js';

const app = express();


app.use(cors({
    origin: "http://localhost:5173", // Dominio del frontend
    credentials: true, // Permitir cookies y otras credenciales
  }));
app.use(json());
app.use(morgan('dev'));

// Routes
app.use(rolRouter);
app.use(usuarioRouter);
app.use(authRouter);
app.use(sistemaRouter);

export default app;
