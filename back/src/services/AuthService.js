import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { createToken } from "../utils/Jwt.js";
import { getPeruTime, getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

export const login=async(nombreUsuario, contrasena_hash)=>{

    const usuario= await prisma.usuario.findUnique({
        where:{
            nombre_usuario:nombreUsuario,
        }
    });
    if(!usuario){
        throw new Error ("Usuario no encontrado")
    }
    const valido=bcrypt.compareSync(contrasena_hash, usuario.contrasena_hash);
    if(!valido){
        throw new Error("Contraseña incorrecta")
    }

    const payload = {
        userId: usuario.id,
        nombreUsuario: usuario.nombre_usuario

    }
    const token= createToken(payload);
    const expiresInMilliseconds = 24 * 60 * 60 * 1000;
    const expirationUTC = new Date(Date.now() + expiresInMilliseconds);
    const expirationPeru = getUTCTime(expirationUTC.toISOString()); 

    return { token,
        expiracion:expirationPeru.toISOString(),
        userId:usuario.id,
        nombreUsuario: usuario.nombre_usuario

    }
}

export const logout=async(token)=>{
    
}