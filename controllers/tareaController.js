import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tareas.js";

const agregarTarea = async(req,res) => { //395
    const {proyecto} = req.body;

    const existeProyecto = await Proyecto.findById(proyecto);

    if(!existeProyecto) {
        const error = new Error("El proyecto no Existe");
        return res.status(404).json({msg: error.message});
    }

    if(existeProyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("El tienes los permisos para añdir tareas");
        return res.status(403).json({msg: error.message});
    }

    try {
        const tareaAlmacenada = await Tarea.create(req.body);
        //Almacenar el ID en el proyecto 457
        existeProyecto.tareas.push(tareaAlmacenada._id);
        await existeProyecto.save();
        res.json(tareaAlmacenada);
    } catch (error) {
        console.log(error);
    }
}

const obtenerTarea = async(req,res) => { //396
    const {id} = req.params

    const tarea = await Tarea.findById(id).populate("proyecto");

    if(!tarea) {
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({msg: error.message});  
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no válida");
        return res.status(403).json({msg: error.message});     
    }

    res.json(tarea)
}

const actualizarTarea = async(req,res) => { //397
    const {id} = req.params

    const tarea = await Tarea.findById(id).populate("proyecto");

    if(!tarea) {
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({msg: error.message});
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no válida");
        return res.status(403).json({msg: error.message});    
    }

    tarea.nombre = req.body.nombre || tarea.nombre;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.prioridad = req.body.prioridad || tarea.prioridad;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

    try {
        const tareaAlmacenada = await tarea.save();
        res.json(tareaAlmacenada)
    } catch (error) {
        console.log(error);
    }


}

const eliminarTarea = async(req,res) => { //398
    const {id} = req.params

    const tarea = await Tarea.findById(id).populate("proyecto");

    if(!tarea) {
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({msg: error.message});
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no válida");
        return res.status(403).json({msg: error.message});  
    }

    try {
        const proyecto = await Proyecto.findById(tarea.proyecto); //482
        proyecto.tareas.pull(tarea._id);
        await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()]); //482
        res.json({msg: "La Tarea se eliminó"});
    } catch (error) {
        console.log(error);
    }
}

const cambiarEstado = async(req,res) => { //481
    const {id} = req.params

    const tarea = await Tarea.findById(id).populate("proyecto");

    if(!tarea) {
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({msg: error.message});
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString() && !tarea.proyecto.colaboradores.some(
        (colaborador) => colaborador._id.toString() === req.usuario._id.toString())
        ) {
        const error = new Error("Acción no válida");
        return res.status(403).json({msg: error.message});    
    }

    tarea.estado = (!tarea.estado);
    tarea.completado = req.usuario._id //485
    await tarea.save();

    const tareaAlmacenada = await Tarea.findById(id).populate("proyecto").populate("completado");//485

    res.json(tareaAlmacenada);//485
}

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado,
}