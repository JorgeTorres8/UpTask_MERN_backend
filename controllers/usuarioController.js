import Usuario from "../models/Usuario.js"; //371
import generarId from "../helpers/generarId.js"; //374
import generarJWT from "../helpers/generarJWT.js";//378
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js"; //417

const registrar = async (req, res) => { //370 creamos este Controller

    //Evitar registros duplicados 372
    const {email} = req.body;
    const existeUsuario = await Usuario.findOne({email});

    if(existeUsuario) {
        const error = new Error("This User is already registered");
        return res.status(400).json({msg: error.message})
    }

    try { //371 Crear un nuevo usuario y almacenarlo en la BD
        const usuario = new Usuario(req.body) //creara un objeto con la informacion del modelo
        usuario.token = generarId(); //374
        await usuario.save(); //para guardar en la BD; .save permitira tener un obj, mod y almecenarlo //415

        //Enviar el Email de confirmación 417

        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        res.json({msg: 'User created successfully, check your email to consult your account'}); //415
    } catch (error) {
        console.log(error);
    }
};

const autenticar = async (req, res) => { //375 contendido en 376
    const {email, password} = req.body;
    
    //comprobar si el usuario existe
    const usuario = await Usuario.findOne({email});
    if(!usuario) {
        const error = new Error("The user does not exist");
        return res.status(404).json({msg: error.message })
    }

    //Comprobar si el usuario está confirmado
    if(!usuario.confirmado) {
        const error = new Error("Your account has not been confirmed")
        return res.status(403).json({msg: error.message})
    }
    
    //Comprobar su password 376
    if(await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id),//378
        });
    } else {
        const error = new Error("The password is wrong")
        return res.status(403).json({msg: error.message})
    }
};

const confirmar = async (req, res) => { //379 contenido en 380
    const {token} = req.params; //params pq vamos a leer la url
    
    const usuarioConfirmar =  await Usuario.findOne({token});
    
    if(!usuarioConfirmar) {
        const error = new Error("Invalid Token");
        return res.status(403).json({msg : error.message})    
    }

    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = "";
        await usuarioConfirmar.save();
        res.json({msg: 'User confirmed successfully'})
    } catch (error) {
        console.log(error);
    }
};

const olvidePassword = async (req, res) => { //381
    const {email} = req.body;

    const usuario = await Usuario.findOne({email});
    if(!usuario) {
        const error = new Error("The user does not exist")
        return res.status(404).json({msg: error.message});
    }

    try {
        usuario.token = generarId();
        await usuario.save();

        
        emailOlvidePassword({ //Enviar el email 421
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        res.json({msg: "We have sent an email with the instructions"})
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async (req, res) => { //382
    const {token} = req.params;

    const tokenValido = await Usuario.findOne({token});
    if(tokenValido) {
        res.json({msg: 'Valid token and user exists'})
    } else {
        const error = new Error("Invalid Token")
        return res.status(404).json({msg: error.message});
    }
}

const nuevoPassword = async (req, res) => { //383
    const {token} = req.params;
    const {password} = req.body;

    const usuario = await Usuario.findOne({token});

    if(usuario) {
        usuario.password =  password;
        usuario.token = "";
        try {
            await usuario.save();
            res.json({msg: "Password modified successfully"})
        } catch (error) {
            console.log(error);
        }

    } else {
        const error = new Error("Invalid Token")
        return res.status(404).json({msg: error.message});
    } 
}

const perfil = async (req,res) => { //384
    const {usuario} = req
    res.json(usuario)
}

export {registrar, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil,};