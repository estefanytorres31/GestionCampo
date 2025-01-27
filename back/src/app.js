import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';

//Rutas
import rolRouter from './routes/RolRoute.js';
import usuarioRouter from './routes/UsuarioRoute.js';
import authRouter from './routes/AuthRoute.js';
import puertoRouter from './routes/PuertoRoute.js';
import empresaRouter from './routes/EmpresaRoute.js';
import empresaEmbarcacionRouter from './routes/EmpresaEmbarcacionRoute.js';
import historialPuertoRouter from './routes/HistorialPuertoRoute.js';
import embarcacionRouter from './routes/EmbarcacionRoute.js';

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
app.use(puertoRouter);
app.use(empresaRouter);
app.use(empresaEmbarcacionRouter);
app.use(historialPuertoRouter);
app.use(embarcacionRouter);

export default app;
