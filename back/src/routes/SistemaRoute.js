import{
    getSistemas,
    getSistemaById,
    createSistema,
    deleteSistema,
    updateSistema
} from "../controllers/SistemaController.js"
import {Router} from "express"

const sistemaRouter = Router()

sistemaRouter.get('/', getSistemas)
sistemaRouter.get('/:id', getSistemaById)
sistemaRouter.post('/', createSistema)
sistemaRouter.delete('/:id', deleteSistema)
sistemaRouter.put('/:id', updateSistema)

export default sistemaRouter
