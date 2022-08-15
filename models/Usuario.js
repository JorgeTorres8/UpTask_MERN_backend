import mongoose from "mongoose";
import bcrypt from "bcrypt"; //373 instalamos con npm i bcrypt (leer sobre Middleware de mongoose)

const usuarioSchema = mongoose.Schema({ //367
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    token: {
        type: String,
    },
    confirmado: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true, //creará dos columnas mas, una de creado y otra de actualizado ???¿??¿XD¿?
}
);

usuarioSchema.pre('save', async function(next) { //373 Este código se va a ejecutar antes de guardar el registro en la BD 
    if(!this.isModified("password")) {//Si no estas modificando el password, entonces no hagas nada
        next(); // express tiene este next() para mandarte al siguiente Middleware (asi NO utilizamos return pq cancela el resto de los codigos)
    }
    
    const salt = await bcrypt.genSalt(10) //mientras mas rondas tengas crea un hash mas seguro pero consume en el servidor
    this.password = await bcrypt.hash(this.password, salt);
});

usuarioSchema.methods.comprobarPassword = async function(passwordFormulario) { //377
    return await bcrypt.compare(passwordFormulario, this.password)
} 

const Usuario = mongoose.model("Usuario", usuarioSchema)//Definimos el modelo
export default Usuario; 