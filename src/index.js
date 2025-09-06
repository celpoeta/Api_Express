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

// Ruta PUT /api/users/:id
// Objetivo: reemplazar COMPLETAMENTE un usuario existente en el archivo users.json
app.put('/api/users/:id', validateId, validateUserBody, normalizeUserBody, async (req, res, next) => {
    try {
        // Obtenemos el parámetro id de la URL y lo convertimos a número
        const userId = req.params.id;
        const name = req.body.name;
        const email = req.body.email;

        // Leemos el archivo users.json como texto
        const data = await fs.readFile(userPath, 'utf8');

        // Parseamos el contenido a un arreglo de usuarios
        const users = JSON.parse(data);

        // Buscamos el índice del usuario cuyo id coincida con userId
        const userIndex = users.findIndex((user) => user.id === userId);

        // Si no existe, devolvemos error 404
        if (userIndex === -1) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Reemplazamos completamente el objeto del usuario
        users[userIndex] = { id: userId, name, email };

        // Guardamos (reescribimos) el archivo users.json con la lista actualizada
        await fs.writeFile(userPath, JSON.stringify(users, null, 2));

        // Respondemos con el usuario actualizado
        res.json(users[userIndex]);
    } catch (error) {
        next(error);
    }
});

// Ruta PATCH /api/users/:id
// Objetivo: actualizar SOLO algunos campos de un usuario existente en el archivo users.json
app.patch('/api/users/:id', validateId, validatePatchUser, normalizeUserBody, async (req, res, next) => {
    try {
        // Obtenemos el parámetro id de la URL y lo convertimos a número
        const userId = req.params.id;

        // Extraemos los datos enviados por el cliente en el body (opcionales en PATCH)
        const name = req.body.name;
        const email = req.body.email;

        // Leemos el archivo users.json como texto
        const data = await fs.readFile(userPath, 'utf8');

        // Parseamos el contenido a un arreglo de usuarios
        const users = JSON.parse(data);

        // Buscamos al usuario cuyo id coincida con userId
        const user = users.find((user) => user.id === userId);

        // Si no existe, devolvemos error 404
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // IMPORTANTE:
        // 'user' no es una copia, sino una REFERENCIA al objeto dentro del arreglo 'users'.
        // Por lo tanto, si modificamos 'user', también se modifica el arreglo 'users'.
        // Ejemplo:
        //   user.name = 'Nuevo'  →  users ya tiene ese cambio internamente.
        if (typeof name === 'string' && name.trim() !== '') {
            user.name = name;
        }
        if (typeof email === 'string' && email.trim() !== '') {
            user.email = email;
        }

        // Guardamos el archivo users.json con el usuario ya modificado
        await fs.writeFile(userPath, JSON.stringify(users, null, 2));

        // Respondemos con el usuario modificado
        res.json(user);
    } catch (error) {
        next(error);
    }
});

// RUTA DELETE /api/users/:id
// Objetivo: eliminar un usuario existente
app.delete('/api/users/:id', validateId, async (req, res) => {
    try {
        // Obtenemos el parámetro id de la URL y lo convertimos a número
        const userId = req.params.id;

        // Leemos el archivo users.json como texto
        const data = await fs.readFile(userPath, 'utf8');

        // Parseamos el contenido a un arreglo de usuarios
        const users = JSON.parse(data);

        // Buscamos el índice del usuario cuyo id coincida con userId
        const userIndex = users.findIndex((user) => user.id === userId);

        // Si no existe, devolvemos error 404
        if (userIndex === -1) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const deleteUser = users[userIndex];

        // Eliminamos el usuario
        users.splice(userIndex, 1);

        // Actualizar el archivo users.json
        await fs.writeFile(userPath, JSON.stringify(users, null, 2));

        // respuesta al cliente
        res.json({
            message: `Usuario con id ${userId} eliminado correctamente`,
            user: { name: deleteUser.name, email: deleteUser.email },
        });
    } catch (error) {
        next(error);
    }
});

app.use(errorHandler);

// ---------------------- LEVANTAR SERVIDOR ---------------------- //
// Iniciamos el servidor en el puerto indicado
// Cuando esté listo, mostramos un mensaje en consola
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
