//361 este archivo tendrá la config de mi servidor
import express from "express"; //362 para esto (mod package.json despues de description)
//const express =  require("express"); Se comenta porque es el CommonJS y es incomodo 632 por eso utilizamos el ESM arriba
import dotenv from "dotenv"; //365
import cors from "cors"; //415 permite la implementacion del cors para permitir las conexiones desde el dominio del frontend  
import conectarDB from "./config/db.js"; //364
import usuarioRoutes from "./routes/usuarioRoutes.js" //368
import proyectoRoutes from "./routes/proyectoRoutes.js" //388
import tareaRoutes from "./routes/tareaRoutes.js" //394

const app = express();
app.use(express.json()); //371 para que procese la información tipo JSON
dotenv.config(); //365 con esta configuracion va a buscar por un archivo que es el ENV

conectarDB(); //364

// Configurar CORS 415
const whitelist = [process.env.FRONTEND_URL]; //dominio permitido

const corsOptions = { //segun la documentacion de cors
    origin: function(origin, callback) { //quien esta enviando el reques? origen xD 
        if(whitelist.includes(origin)) {
            //Puede consultar la API
            callback(null, true);
        } else {
            //no esta permitido
            callback( new Error("Error de Cors"));
        }
    },
};
app.use(cors(corsOptions));

//Routing 368
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes); //388
app.use("/api/tareas", tareaRoutes); //394

const PORT = process.env.PORT || 4000//365 esta variable de entorno se creará en el servidor de produccion automaticamente

const servidor = app.listen(PORT, () => { //489 const server 
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Socket.io 489

import {Server} from 'socket.io';

const io = new Server(servidor, { //para tener la referencia de nuestra aplicación
    pingTimeout: 60000, //default
    cors: { //de donde vienen las peticiones
        origin: process.env.FRONTEND_URL,
    },
});

io.on('connection', (socket) => { //abrir conexion de Socket.io
    //console.log('Conectado a socket.io');

    //Definir los Eventos de socket io 491

    socket.on("abrir proyecto", (proyecto) => { //493
        socket.join(proyecto); //cada usuario entrará a un socket diferente ... y esto me permite entrar a este cuarto
    });

    socket.on("nueva tarea", (tarea) => { //494
        const proyecto = tarea.proyecto;
        socket.to(proyecto).emit('tarea agregada', tarea)
    });

    socket.on("eliminar tarea", (tarea) => { //495
        const proyecto = tarea.proyecto;
        socket.to(proyecto).emit('tarea eliminada', tarea)
    });

    socket.on("actualizar tarea", (tarea) => { //496
        const proyecto = tarea.proyecto._id;
        socket.to(proyecto).emit('tarea actualizada', tarea)
    })

    socket.on('cambiar estado', (tarea) => { //497
        const proyecto = tarea.proyecto._id;
        socket.to(proyecto).emit('nuevo estado', tarea);
    })

    /*socket.on('prueba', (proyectos) => { // que es lo que va a hacer cuando ese evento ocurra
        console.log('Pruevb', proyectos);

        socket.emit("respuesta", {nombre: 'chipi?'}); //492 enviar un evento (Pasar del backend hacia el frontend)
    })COMENTADO 492 TUTORURIAL*/
}) 
