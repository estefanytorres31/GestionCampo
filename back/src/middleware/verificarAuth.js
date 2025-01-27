import { verifyToken } from "../utils/Jwt.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const authMiddleware = async (req, res, next) => {
 try{
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({error: "Requiere token de autorización"})
    }
    const {id} = verifyToken(token);
    const user=await prisma.usuario.findUnique({
        where: {
            id:parseInt(id)
        },
        select: {
            id: true
        }
    })
    req.user = user;
    next();
 }catch(e){
    res.status(401).json({ message: e.message });
    return;
 }
};
  