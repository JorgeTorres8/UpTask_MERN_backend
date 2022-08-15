import jwt from "jsonwebtoken";

const generarJWT = (id) => { //378
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d",})//nos permite generar un JWT
}

export default generarJWT;