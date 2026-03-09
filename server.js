import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

// Conectar a DB
connectDB();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
];


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

// Middlewares globales
app.use(cors(corsOptions));
app.use(express.json());

// Rutas
app.use('/api', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));