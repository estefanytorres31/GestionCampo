import * as ParteService from "../services/ParteService.js";

export const createParte=async(req, res)=>{
    try {
        const { nombre_parte } = req.body;
        const parte = await ParteService.createParte(nombre_parte);
        res.status(201).json(parte);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getPartes=async(req, res)=>{
    try {
        const partes = await ParteService.getAllPartes();
        res.json(partes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getParteById=async(req, res)=>{
    try {
        const { id } = req.params;
        const parte = await ParteService.getParteById(id);
        if (!parte) return res.status(404).json({ message: 'Parte not found' });
        res.json(parte);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateParte=async(req, res)=>{
    try {
        const { id } = req.params;
        const { nombre_parte } = req.body;
        const updatedParte = await ParteService.updateParte(id, nombre_parte);
        if (!updatedParte) return res.status(404).json({ message: 'Parte not found' });
        res.json(updatedParte);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteParte=async(req, res)=>{
    try {
        const { id } = req.params;
        const deletedParte = await ParteService.deleteParte(id);
        if (!deletedParte) return res.status(404).json({ message: 'Parte not found' });
        res.json({message:'Parte eliminado'});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}