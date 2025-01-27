import * as AuthService from "../services/AuthService.js";

export const login = async(req, res) => {
    const { usuario, contrasena } = req.body;
    try{
        const user = await AuthService.login(usuario, contrasena);
        res.json(user);
    }catch(err){
        res.status(401).json({ message: "Invalid credentials" });
        console.error(err);

    }
}