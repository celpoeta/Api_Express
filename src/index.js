// Importamos las librerías necesarias
import express from 'express'; // Framework de tercero para crear el servidor y manejar rutas HTTP
import fs from 'node:fs/promises'; // Módulo nativo para trabajar con archivos de forma asíncrona usando Promesas
import path from 'node:path'; // Módulo nativo para manejar rutas de archivos y carpetas
import { errorHandler } from './middlewares/error-handler.js';
import { validateId } from './middlewares/users/validate-id.js';
import { validateUserBody } from './middlewares/users/validate-user-body.js';
import { normalizeUserBody } from './middlewares/users/normalize-user-body.js';
import { validatePatchUser } from './middlewares/users/validate-patch-user.js';
import { ensureUniqueEmail } from './middlewares/users/ensure-unique-email.js';

import userRouter from './routes/users.routes.js'


// Definimos la ruta del archivo JSON donde tenemos a nuestros usuarios
// OJO: esta es una ruta relativa, funciona siempre que ejecutemos node desde la raíz del proyecto (mas adelante lo haremos mas robusto)
const userPath = path.join('data', 'users.json');

// Creamos la aplicación de Express
const app = express();

// Middelware
app.use(express.json());

// Definimos el puerto donde correrá el servidor
const PORT = 3010;

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
