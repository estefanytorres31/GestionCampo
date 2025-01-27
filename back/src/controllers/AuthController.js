import * as AuthService from "../services/AuthService.js";

export const login = async(req, res) => {
    const { nombre_usuario, contrasena } = req.body;
    try{
        const user = await AuthService.login(nombre_usuario, contrasena);
        res.json(user);
    }catch(err){
        res.status(401).json({ message: "Invalid credentials" });
        console.error(err);

    }
}