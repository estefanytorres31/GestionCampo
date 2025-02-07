import { Router } from "express";
import { setUserTheme, getUserTheme } from "../controllers/UserConfigurationController.js";

const routerConfiguration = Router();

routerConfiguration.post("/", setUserTheme);

routerConfiguration.get("/:usuarioId", getUserTheme);

export default routerConfiguration;