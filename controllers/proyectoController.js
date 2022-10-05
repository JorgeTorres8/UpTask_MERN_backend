import Proyecto from "../models/Proyecto.js"; //388
import Usuario from "../models/Usuario.js"; //470

const obtenerProyectos = async (req,res) => { //389
    const proyectos = await Proyecto.find({
        $or: [ //477
            {colaboradores: {$in: req.usuario}},
            {creador: {$in: req.usuario}},
        ],
    }).select("-tareas"); //458
        /*.where("creador") comentado en 477
        .equals(req.usuario)*/
    res.json(proyectos);
};

const nuevoProyecto = async (req,res) => { //388
    const proyecto = new Proyecto(req.body);
    proyecto.creador = req.usuario._id

    try {
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error);
    }
};

const obtenerProyecto = async (req,res) => { //390
    const {id} = req.params;
        
    const proyecto = await Proyecto.findById(id)
    .populate({path: 'tareas', populate: {path: 'completado', select: "nombre"}}) //458 div populate 485
    .populate("colaboradores", "nombre email"); //473 

    if(!proyecto) {
        const error = new Error("Not found");
        return res.status(404).json({msg: error.message});
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString() && !proyecto.colaboradores.some(colaborador => colaborador._id.toString() 
    === req.usuario._id.toString() )) { //478 modificado segunda condicion &&
        const error = new Error("Invalid action");
        return res.status(401).json({msg: error.message});
    }

    //Obtener las tareas del proyecto //400
    //const tareas = await Tarea.find().where("proyecto").equals(proyecto._id); COMENTADO VIDEO 442

    res.json(
        proyecto,
        //tareas, COMENTADO VIDEO 442
    );
};

const editarProyecto = async (req,res) => {
    const {id} = req.params;
    const proyecto = await Proyecto.findById(id);

    if(!proyecto) {
        const error = new Error("Not found");
        return res.status(404).json({msg: error.message})
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Invalid action");
        return res.status(404).json({msg: error.message})
    }

    proyecto.nombre = req.body.nombre || proyecto.nombre;
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
    proyecto.cliente = req.body.cliente || proyecto.cliente;

    try {
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error);
    }
};

const eliminarPoyecto = async (req,res) => { //392
    const {id}= req.params;
    const proyecto = await Proyecto.findById(id);

    if(!proyecto){
        const error = new Error("Not found");
        res.status(404).json({msg: error.message});
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Invalid action");
        return res.status(404).json({msg: error.message})
    }

    try {
        await proyecto.deleteOne();
        res.json({msg: "Deleted Project"})
    } catch (error) {
        console.log(error);
    }
};

const buscarColaborador = async (req,res) => {
    const {email} = req.body;
    const usuario = await Usuario.findOne({email}).select("-confirmado -createdAt -password -token -updatedAt -__v");

    if(!usuario) {
        const error = new Error("User not found");
        return res.status(404).json({msg: error.message});
    }

    res.json(usuario);
};

const agregarColaborador = async (req,res) => { //472
    const proyecto = await Proyecto.findById(req.params.id);

    if(!proyecto) {
        const error = new Error("Project Not Found");
        return res.status(404).json({msg: error.message});
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Invalid action");
        return res.status(404).json({msg: error.message});
    }

    const {email} = req.body;
    const usuario = await Usuario.findOne({email}).select("-confirmado -createdAt -password -token -updatedAt -__v");

    if(!usuario) {
        const error = new Error("User not found");
        return res.status(404).json({msg: error.message});
    }

    //El colaborador no es el admin del proyecto
    if(proyecto.creador.toString() === usuario._id.toString()) {
        const error = new Error("The project creator cannot be a collaborator");
        return res.status(404).json({msg: error.message});
    }

    if(proyecto.colaboradores.includes(usuario._id)) {
        const error = new Error("The user already belongs to the Project");
        return res.status(404).json({msg: error.message});
    }

    //Agregar al colaborador
    proyecto.colaboradores.push(usuario._id);
    await proyecto.save()
    res.json({msg: 'Contributor added successfully'})


};

const eliminarColaborador = async (req,res) => { //476
    const proyecto = await Proyecto.findById(req.params.id);

    if(!proyecto) {
        const error = new Error("Project Not Found");
        return res.status(404).json({msg: error.message});
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Invalid action");
        return res.status(404).json({msg: error.message});
    }

    //Eliminar Colaborador
    proyecto.colaboradores.pull(req.body.id); //pull para sacar un elemento de un arreglo
    await proyecto.save();
    res.json({msg: 'Contributor successfully deleted'});
};

export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarPoyecto,
    buscarColaborador,  //470
    agregarColaborador,
    eliminarColaborador,

}