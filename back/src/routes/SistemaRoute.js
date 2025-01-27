import{
    getSistemas,
    getSistemaById,
    createSistema,
    deleteSistema,
    updateSistema
} from "../controllers/SistemaController.js"
import {Router} from "express"

const sistemaRouter = Router()

sistemaRouter.get('/api/sistema', getSistemas)
sistemaRouter.get('/api/sistema/:id', getSistemaById)
sistemaRouter.post('/api/sistema', createSistema)
sistemaRouter.delete('/api/sistema/:id', deleteSistema)
sistemaRouter.put('/api/sistema/:id', updateSistema)

export default sistemaRouter
