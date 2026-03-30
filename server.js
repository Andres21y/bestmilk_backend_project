import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';
import mainRoutes from './routes/index.js';


const app = express();

// Conectar a DB
connectDB();

const allowedOrigins = ['http://localhost:5173', process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    // Si el origen está en la lista o si es una petición local (sin origen)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Origen no permitido por CORS:", origin); // Esto saldrá en los logs de Vercel
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Añadimos OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200 
};

// Middlewares globales de la app
app.use(helmet()); // Protege encabezados HTTP
/*
app.use(mongoSanitize({
  replaceWith: '_', // reemplaza operadores prohibidos con "_"
})); // Previene NoSQL Injection (elimina $ de los inputs)*/
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));

// Rutas
app.use('/api', mainRoutes);

export default app;

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));