import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import fileUpload from 'express-fileupload';

//Rutas
import rolRouter from './routes/RolRoute.js';
import usuarioRouter from './routes/UsuarioRoute.js';
import authRouter from './routes/AuthRoute.js';
import sistemaRouter from './routes/SistemaRoute.js';
import puertoRouter from './routes/PuertoRoute.js';
import empresaRouter from './routes/EmpresaRoute.js';
import empresaEmbarcacionRouter from './routes/EmpresaEmbarcacionRoute.js';
import historialPuertoRouter from './routes/HistorialPuertoRoute.js';
import embarcacionRouter from './routes/EmbarcacionRoute.js';
import permisoRouter from './routes/PermisoRoute.js';

const app = express();


app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true, 
  }));
app.use(json());
app.use(morgan('dev'));
app.use(fileUpload({
  useTempFiles: true,
}));

// Routes
app.use('/api/rol', rolRouter);
app.use('/api/usuario', usuarioRouter);
app.use('/api/auth', authRouter);
app.use('/api/sistema', sistemaRouter);
app.use('/api/puerto', puertoRouter);
app.use('/api/empresa', empresaRouter);
app.use('/api/empresa-embarcacion', empresaEmbarcacionRouter);
app.use('/api/historial-puerto', historialPuertoRouter);
app.use('/api/embarcacion', embarcacionRouter);
app.use('/api/permiso', permisoRouter);

export default app;
