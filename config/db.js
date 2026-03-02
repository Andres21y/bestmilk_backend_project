// Importamos la librería mongoose, que nos permite interactuar con MongoDB
import mongoose from 'mongoose';

// Función para conectar la aplicación a la base de datos MongoDB.
const connectDB = async () => {
    try {
        // Intentamos establecer la conexión con la URL definida en las variables de entorno
        await mongoose.connect(process.env.MONGO_URL);

        console.log("Successful connection to the database");

    } catch (err) {
        // Si ocurre un error, lo mostramos en consola con detalles
        console.error("Database connection error:", err.message);

        // process.exit(1) detiene la aplicación indicando que hubo un error crítico
        process.exit(1);
    }
};

export default connectDB;