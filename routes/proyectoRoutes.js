import express from 'express'; //387
import {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarPoyecto,
    buscarColaborador,  //470
    agregarColaborador,
    eliminarColaborador,
} from '../controllers/proyectoController.js' //388
import checkAuth from '../middleware/checkAuth.js'

const router = express.Router();

router
    .route("/")
    .get(checkAuth, obtenerProyectos)
    .post(checkAuth, nuevoProyecto);

router
    .route("/:id")
    .get(checkAuth, obtenerProyecto)
    .put(checkAuth,editarProyecto)
    .delete(checkAuth, eliminarPoyecto);

router.post('/colaboradores', checkAuth, buscarColaborador); //470
router.post('/colaboradores/:id', checkAuth, agregarColaborador);
router.post('/eliminar-colaborador/:id', checkAuth, eliminarColaborador); //476 cambiamos de Delete a Post: un delete no se puede enviar valores

export default router;