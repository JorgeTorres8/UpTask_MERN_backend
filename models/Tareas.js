import mongoose from 'mongoose';

const tareaSchema = mongoose.Schema({ //393
    nombre: {
        type: String,
        trim: true,
        required: true,
    },
    descripcion: {
        type: String,
        trim: true,
        required: true,
    },
    estado: {
        type: Boolean,
        default: false,
    },
    fechaEntrega: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    prioridad: {
        type: String,
        requiured: true,
        enum: ["Low", "Medium", "High"],//permite unicamente los valores que estan en este arreglo
    },
    proyecto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Proyecto",
    },
    completado: { //485
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
    },
}, {
    timestamps: true
});

const Tarea = mongoose.model("Tarea", tareaSchema);
export default Tarea;