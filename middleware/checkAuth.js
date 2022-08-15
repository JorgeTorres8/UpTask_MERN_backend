import jwt from 'jsonwebtoken' //385
import Usuario from '../models/Usuario.js';

const checkAuth = async (req, res, next) => { //384 contenido en 385
    let token; 
        if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer") //para enviarle un token a esos headers
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.usuario =  await Usuario.findById(decoded.id).select("-password -confirmado -token -createdAt -updatedAt -__v");
            
            return next();  // una vez que verificamos el jwt y lo asignamos al request nos iremos al siguiente Middleware
        } catch (error) {
            return res.status(404).json({msg: 'Hubo un error'})
        }
    }

    if(!token) {
        const error = new Error('Token no válido')
        return res.status(401).json({msg: error.message})
    }

    next();
}

export default checkAuth;