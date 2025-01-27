import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import jwt from "jsonwebtoken"


/**
 * Middleware para verificar la autenticación del usuario.
 *
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @param {Function} next - La función middleware siguiente en la pila.
 * @returns {Promise<void>} - Continúa con la siguiente función middleware si el token es válido.
 * 
 * @throws {Error} - Si el token de autorización no está presente o es inválido.
 *
 * @description Este middleware verifica que la solicitud incluya un token de autorización válido
 * en los encabezados. Si el token es válido, extrae el ID del usuario y lo adjunta al objeto de solicitud.
 * Si el token no es válido o está ausente, responde con un error 401 (No autorizado).
 */
export const verificarAuth = async (req, res, next) => {

    //Verificar autenticación
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({error: "Requiere token de autorización"})
    }

    const token = authorization.split(' ')[1]

    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const usuario = await prisma.usuario.findUnique({
            where: {
                id: parseInt(userId)
            },
            select: {
                id: true
            }
        })
        req.usuario = usuario
        next()

    } catch (error) {
        console.log(error)
        res.status(401).json({error: "No autorizado"})
    }
}


/**
 * Middleware para verificar que el usuario autenticado sea un administrador.
 *
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @param {Function} next - La función middleware siguiente en la pila.
 * @returns {Promise<void>} - Continúa con la siguiente función middleware si el usuario es administrador.
 * 
 * @throws {Error} - Si el usuario no tiene el rol de administrador.
 *
 * @description Este middleware verifica que el usuario autenticado tenga el rol de administrador.
 * Si el usuario tiene el rol de administrador, permite continuar con la siguiente función middleware.
 * Si no, responde con un error 403 (Prohibido).
 */
export const isAdmin = async (req, res, next) => {
    try {
        const usuario = await prisma.usuario.findUnique({
            where: {
                id: req.usuario.id,
            }
        })
    
        if(usuario && usuario.rol === "Admin") {
            next()
        } else {
            return res.status(403).json({message: "Requiere rol de Administrador"})
        }
        } catch (error) {
        console.error("Error en middleware", error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}


/**
 * Middleware para verificar que el usuario autenticado sea un propietario.
 *
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @param {Function} next - La función middleware siguiente en la pila.
 * @returns {Promise<void>} - Continúa con la siguiente función middleware si el usuario es propietario.
 * 
 * @throws {Error} - Si el usuario no tiene el rol de propietario.
 *
 * @description Este middleware verifica que el usuario autenticado tenga el rol de propietario.
 * Si el usuario tiene el rol de propietario, permite continuar con la siguiente función middleware.
 * Si no, responde con un error 403 (Prohibido).
 */
export const isPropietario = async (req, res, next) => {
    try {
    const usuario = await prisma.usuario.findUnique({
        where: {
            id: req.usuario.id,
        }
    })

    if(usuario && usuario.rol === "Propietario") {
        next()
    } else {
        return res.status(403).json({message: "Requiere rol de Propietario"})
    }
    } catch (error) {
    // Manejar cualquier error de la base de datos u otros errores
    console.error("Error en middleware isPropietario:", error);
    return res.status(500).json({ message: "Error en el servidor" });
}
}


/**
 * Middleware para verificar que el usuario autenticado sea un empleado.
 *
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @param {Function} next - La función middleware siguiente en la pila.
 * @returns {Promise<void>} - Continúa con la siguiente función middleware si el usuario es empleado.
 * 
 * @throws {Error} - Si el usuario no tiene el rol de empleado.
 *
 * @description Este middleware verifica que el usuario autenticado tenga el rol de empleado.
 * Si el usuario tiene el rol de empleado, permite continuar con la siguiente función middleware.
 * Si no, responde con un error 403 (Prohibido).
 */
export const isEmpleado = async (req, res, next) => {
    try {
        const usuario = await prisma.usuario.findUnique({
            where: {
                id: req.usuario.id,
            }
        })
    
        if(usuario && usuario.rol === "Empleado") {
            next()
        } else {
            return res.status(403).json({message: "Requiere rol de Empleado"})
        }
        } catch (error) {
        // Manejar cualquier error de la base de datos u otros errores
        console.error("Error en middleware", error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}