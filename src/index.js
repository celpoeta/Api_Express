// Importamos las librerías necesarias
import express from 'express'; // Framework de tercero para crear el servidor y manejar rutas HTTP
import { errorHandler } from './middlewares/error-handler.js';

import userRouter from './routes/users.routes.js'

// Creamos la aplicación de Express
const app = express();

// Middelware
app.use(express.json());

// Definimos el puerto donde correrá el servidor
const PORT = process.env.PORT || 3000;

// ---------------------- RUTAS ---------------------- //

// Ruta raíz de prueba: GET /
// Sirve para comprobar que el servidor está corriendo correctamente
app.get('/', (_req, res) => {
    res.send('Hello World'); // Respuesta de texto plano
});

app.use('/api/users', userRouter);

app.use(errorHandler);

// ---------------------- LEVANTAR SERVIDOR ---------------------- //
// Iniciamos el servidor en el puerto indicado
// Cuando esté listo, mostramos un mensaje en consola
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
