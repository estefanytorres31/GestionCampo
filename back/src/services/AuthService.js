import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { createToken } from "../utils/Jwt.js";
import { getPeruTime, getUTCTime } from "../utils/Time.js";

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

    const payload = {
        userId: usuario.id,
        nombreUsuario: usuario.nombreUsuario

    }
    const token= createToken(payload);
    const expiresInMilliseconds = 24 * 60 * 60 * 1000;
    const expirationDate = new Date(Date.now() + expiresInMilliseconds);

    return {token,
        expiracion:expirationDate.toISOString() ,
        usuario:{
        id: usuario.id,
        nombreUsuario: usuario.nombreUsuario,
        nombreCompleto: usuario.nombreCompleto,
        email: usuario.email
    }}
}