import express from "express";
const router = express.Router(); //368
import { 
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil,
} from "../controllers/usuarioController.js";

import checkAuth from '../middleware/checkAuth.js'; //384

//370 Autenticación, Registro y Confirmación de Usuarios
router.post("/", registrar); //Crea un nuevo Usuario
router.post("/login", autenticar); //375
router.get("/confirmar/:token", confirmar);//379
router.post("/olvide-password", olvidePassword) //381
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword); // dos rutas en una 383 comprobar token en 382

router.get("/perfil", checkAuth, perfil); //384 si esta autenticado entoncs accede al perfil
export default router