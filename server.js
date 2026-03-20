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
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },

  methods: ['GET', 'POST', 'PUT', 'DELETE'], // métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // cabeceras permitidas
  credentials: true // permite enviar cookies o auth headers
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