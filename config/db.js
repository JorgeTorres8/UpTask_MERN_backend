import mongoose from "mongoose";//364 Aqui colocaremos el String de conexión y el código para conectarnos a la BD

const conectarDB = async () => {
    try {
        const connection = await mongoose.connect(
            process.env.MONGO_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const url = `${connection.connection.host}:${connection.connection.port}`
        console.log(`${url}`);


    } catch (error) {
        console.log(`error: ${error.messange}`);
        process.exit(1);//forzará que el proceso termine 
    }
}

export default conectarDB;