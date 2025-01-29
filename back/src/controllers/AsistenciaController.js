import * as AsistenciaService from "../services/AsistenciaService.js";

export const registrarEntrada=async(req, res)=>{
    const { id_usuario,id_embarcacion, id_orden_trabajo, id_puerto, latitud, longitud}=req.body

    try {
        const asistencia=await AsistenciaService.registrarEntrada(id_usuario,id_embarcacion, id_orden_trabajo, id_puerto, latitud, longitud);
        res.status(201).json(asistencia);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error al registrar la asistencia'});
    }
}

export const registrarSalida=async(req, res)=>{
    const{ id_usuario,id_embarcacion, id_orden_trabajo, id_puerto, latitud, longitud}=req.body
    try {
        const asistencia=await AsistenciaService.registrarSalida(id_usuario,id_embarcacion, id_orden_trabajo, id_puerto, latitud, longitud);
        res.status(201).json(asistencia);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error al registrar la salida'});
    }
}

export const getAllAsistencias=async (req, res) => {
    try {
        const asistencias = await AsistenciaService.getAllAsistencias();
        res.json(asistencias);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las asistencias' });
    }
}

export const getAsistenciaById=async (req,res)=>{
    const { id_asistencia } = req.params;
    try {
        const asistencia = await AsistenciaService.getAsistenciaById(id_asistencia);
        if(!asistencia) return res.status(404).json({message: 'Asistencia no encontrada'});
        res.json(asistencia);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la asistencia' });
    }
}

export const updateAsistencia=async(req, res)=>{
    const { id_asistencia } = req.params;
    const { id_usuario,id_embarcacion, id_orden_trabajo, id_puerto, latitud, longitud}=req.body;
    try {
        const asistencia=await AsistenciaService.updateAsistencia(id_asistencia, {id_usuario,id_embarcacion, id_orden_trabajo, id_puerto, latitud, longitud});
        if(!asistencia) return res.status(404).json({message: 'Asistencia no encontrada'});
        res.json(asistencia);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la asistencia' });
    }
}

export const deleteAsistencia=async(req, res)=>{
    const { id_asistencia } = req.params;
    try {
        const asistencia=await AsistenciaService.deleteAsistencia(id_asistencia);
        if(!asistencia) return res.status(404).json({message: 'Asistencia no encontrada'});
        res.json({message: 'Asistencia eliminada exitosamente'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la asistencia' });
    }
}

export const getAsistenciasByUsuario=async(req, res)=>{
    const { id_usuario } = req.params;
    try {
        const asistencias=await AsistenciaService.getAsistenciasByUsuario(id_usuario);
        res.json(asistencias);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las asistencias por usuario' });
    }
}

export const getAsistenciasByEmbarcacion=async(req, res)=>{
    const { id_embarcacion } = req.params;
    try {
        const asistencias=await AsistenciaService.getAsistenciasByEmbarcaciones(id_embarcacion);
        res.json(asistencias);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las asistencias por embarcación' });
    }
}