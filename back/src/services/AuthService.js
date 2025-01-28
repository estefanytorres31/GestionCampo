import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { createToken } from "../utils/Jwt.js";
import { getPeruTime, getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

export const login=async(nombreUsuario, contrasena_hash)=>{

    const usuario= await prisma.usuario.findUnique({
        where:{
        
            nombreUsuario
        }
    });
    if(!usuario){
        throw new Error ("Usuario no encontrado")
    }
    const valido=bcrypt.compareSync(contrasena_hash, usuario.contrasenaHash);
    if(!valido){
        throw new Error("Contraseña incorrecta")
    }

    const payload = {
        userId: usuario.id,
        nombreUsuario: usuario.nombreUsuario

    }
    const token= createToken(payload);
    const expiresInMilliseconds = 24 * 60 * 60 * 1000;
    const expirationUTC = new Date(Date.now() + expiresInMilliseconds);
    const expirationPeru = getUTCTime(expirationUTC.toISOString()); 

    return { token,
        expiracion:expirationPeru.toISOString(),
        userId:usuario.id,
        nombreUsuario: usuario.nombreUsuario

    }
}

export const logout=async(token)=>{
    
}