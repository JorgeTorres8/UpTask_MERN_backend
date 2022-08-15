import mongoose from "mongoose";

const proyectosSchema = mongoose.Schema({ //386
    nombre: {
        type: String,
        trim: true,
        required: true
    },
    descripcion: {
        type: String,
        trim: true,
        required: true
    },
    fechaEntrega: {
        type: Date,
        default: Date.now(),
    },
    cliente: {
        type: String,
        trim: true,
        required: true,
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId, //va a hacer referencia lo que almacenemos aqui con la coleccion de Usuarios
        ref: "Usuario",
    },
    tareas: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tarea",
        },
    ],
    colaboradores : [ //va a ser un arreglo de usuarios
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Usuario",
        },
    ],
},
    {
        timestamps: true,
    }
);

const Proyecto = mongoose.model("Proyecto", proyectosSchema);
export default Proyecto;