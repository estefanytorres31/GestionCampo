import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const login=async(nombre_usuario, contrasena_hash)=>{
    const usuario= await prisma.usuario.findUnique({
        where:{
            nombreUsuario: nombre_usuario
        }
    });

    if(!usuario){
        throw new Error ("Usuario no encontrado")
    }
    
    const valido=bcrypt.compareSync(contrasena_hash, usuario.contrasenaHash);
    
    if(!valido){
        throw new Error("Contraseña incorrecta")
    }
    
    const token=jwt.sign({userId: usuario.id}, process.env.JWT_SECRET, { expiresIn: '1h'});

    return {token, usuario}


    
}