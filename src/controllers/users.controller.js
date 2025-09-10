import { readUsers, writeUsers } from '../utils/userFile.js';
import * as userService from '../services/users.service.js';


// Ruta GET /api/users
// Objetivo: devolver todos los usuarios guardados en users.json
export async function getUsers(_req, res, next) {
    try {
        const users = await userService.list();
        res.json(users);
    } catch (error) {
        next(error);
    }
}

// Ruta GET /api/users/:id
// Objetivo: devolver un usuario en específico buscando por su id
export async function getUserById(req, res, next) {
    try {

        const user = await userService.get(req.params.id);

        // Si no lo encontramos, devolvemos un error 404
        // Cuando queremos responderle al cliente usamos 'res.'
        //    - 'status(404)' indica el código HTTP de la respuesta (en este caso 404 = No encontrado).
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(user);

    } catch (error) {
        next(error);
    }
}

// Ruta POST /api/users
// Objetivo: crear un nuevo usuario y guardarlo en el archivo users.json
export async function createUser(req, res, next) {
    try {
        const newUser = await userService.create(req.body);

        // Respondemos con estado 201 (Created) y el usuario que fue creado
        res.status(201).json({ message: 'Usuario creado con éxito', newUser });
    } catch (error) {
        next(error);
    }
}

// Ruta PUT /api/users/:id
// Objetivo: reemplazar COMPLETAMENTE un usuario existente en el archivo users.json
export async function replaceUser(req, res, next) {
    try {
        // Obtenemos el parámetro id de la URL y lo convertimos a número
        const userId = req.params.id;

        const replace = await userService.replace(userId, req.body);
        // Si no existe, devolvemos error 404
        if (!replace) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Respondemos con el usuario actualizado
        res.json(replace);
    } catch (error) {
        next(error);
    }
}

// Ruta PATCH /api/users/:id
// Objetivo: actualizar SOLO algunos campos de un usuario existente en el archivo users.json
export async function updateUser(req, res, next) {
    try {
        // Obtenemos el parámetro id de la URL y lo convertimos a número
        const userId = req.params.id;

        // Extraemos los datos enviados por el cliente en el body (opcionales en PATCH)
        const name = req.body.name;
        const email = req.body.email;

        const users = await readUsers();

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

        await writeUsers(user);

        // Respondemos con el usuario modificado
        res.json(user);
    } catch (error) {
        next(error);
    }
}

// RUTA DELETE /api/users/:id
// Objetivo: eliminar un usuario existente
export async function deleteUser(req, res, next) {
    try {
        // Obtenemos el parámetro id de la URL y lo convertimos a número
        const userId = req.params.id;

        const users = await readUsers();

        // Buscamos el índice del usuario cuyo id coincida con userId
        const userIndex = users.findIndex((user) => user.id === userId);

        // Si no existe, devolvemos error 404
        if (userIndex === -1) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const deleteUser = users[userIndex];

        // Eliminamos el usuario
        users.splice(userIndex, 1);

        await writeUsers(user);

        // respuesta al cliente
        res.json({
            message: `Usuario con id ${userId} eliminado correctamente`,
            user: { name: deleteUser.name, email: deleteUser.email },
        });
    } catch (error) {
        next(error);
    }
}