import {
    getParteById,
    getPartes,
    createParte,
    deleteParte,
    updateParte
} from "../controllers/ParteController.js";
import { Router } from "express";

const parteRouter = Router();

parteRouter.get('/', getPartes);
parteRouter.get('/:id', getParteById);
parteRouter.post('/', createParte);
parteRouter.delete('/:id', deleteParte);
parteRouter.put('/:id', updateParte);

export default parteRouter;