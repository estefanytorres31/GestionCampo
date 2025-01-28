import * as SistemaService from "../services/SistemaService.js";

export const createSistema=async(req, res)=>{
    const {nombre_sistema, descripcion} = req.body;
    try{
        const sistema = await SistemaService.createSistema(nombre_sistema, descripcion);
        res.status(201).json(sistema);
    }catch(e){
        res.status(500).json({error: e.message});
    }

}

export const getSistemas=async(req, res)=>{
    try{
        const sistemas = await SistemaService.getAllSistemas();
        res.json(sistemas);
    }catch(e){
        res.status(500).json({error: e.message});
    }
}

export const getSistemaById=async(req,res)=>{
    const {id} = req.params;
    try{
        const sistema = await SistemaService.getSistemaById(id);
        if(!sistema){
            return res.status(404).json({error: "Sistema no encontrado"});
        }
        res.json(sistema);
    }catch(e){
        res.status(500).json({error: e.message});
    }
}

export const updateSistema=async(req,res)=>{
    const {id} = req.params;
    const {nombre_sistema, descripcion} = req.body;
    try{
        const updatedSistema = await SistemaService.updateSistema(id, nombre_sistema, descripcion);
        if(!updatedSistema){
            return res.status(404).json({error: "Sistema no encontrado"});
        }
        res.json(updatedSistema);
    }catch(e){
        res.status(500).json({error: e.message});
    }
}

export const deleteSistema=async(req,res)=>{
    const {id} = req.params;
    try{
        const deletedSistema = await SistemaService.deleteSistema(id);
        if(!deletedSistema){
            return res.status(404).json({error: "Sistema no encontrado"});
        }
        res.json({message:'Sistema eliminado'});
    }catch(e){
        res.status(500).json({error: e.message});
    }
}