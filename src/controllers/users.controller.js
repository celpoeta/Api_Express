import fs from 'node:fs/promises';
import path from 'node:path';
const userPath = path.join('data', 'users.json');

// Ruta GET /api/users
// Objetivo: devolver todos los usuarios guardados en users.json
export async function getUsers(_req, res, next) {
    try {
        // Leemos el archivo users.json como texto con codificación utf8
        const data = await fs.readFile(userPath, 'utf8');

        // Convertimos el texto JSON a un arreglo de objetos JavaScript
        const users = JSON.parse(data);

        // Cuando queremos responderle al cliente usamos 'res.'
        //    - 'json(...)' envía un objeto JSON al cliente como respuesta.
        res.json(users);
    } catch (error) {
        next(error);
    }
}

// Ruta GET /api/users/:id
// Objetivo: devolver un usuario en específico buscando por su id
export async function getUserById(req, res, next) {
    try {
        // Leemos el archivo users.json
        const data = await fs.readFile(userPath, 'utf8');

        // Parseamos el contenido a un arreglo de usuarios
        const users = JSON.parse(data);

        // Usamos el método .find() del array:
        // Este método recorre el arreglo y devuelve el PRIMER elemento que cumpla la condición indicada.
        // En este caso, buscamos el usuario cuyo id sea igual al userId recibido en la URL.
        const user = users.find((user) => user.id === req.params.id);

        // Si no lo encontramos, devolvemos un error 404
        // Cuando queremos responderle al cliente usamos 'res.'
        //    - 'status(404)' indica el código HTTP de la respuesta (en este caso 404 = No encontrado).
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Si lo encontramos, devolvemos el objeto usuario
        // Cuando queremos responderle al cliente usamos 'res.'
        //    - 'json(...)' envía un objeto JSON al cliente como respuesta.
        res.json(user);
    } catch (error) {
        next(error);
    }
}

// Ruta POST /api/users
// Objetivo: crear un nuevo usuario y guardarlo en el archivo users.json
export async function createUser(req, res, next) {
    try {
        // Extraemos los datos enviados por el cliente desde el body (name y email)
        // Notas:
        // - 'name' se toma directamente.
        // - 'email' se convierte a minúsculas para evitar duplicados por mayúsculas/minúsculas.
        const name = req.body.name;
        const email = req.body.email;

        // Leemos el archivo users.json
        const data = await fs.readFile(userPath, 'utf8');

        // Parseamos el contenido a un arreglo de usuarios
        const users = JSON.parse(data);

        //Generamos un nuevo ID para el usuario:
        // - Si el arreglo `users` tiene elementos (`users.length` es verdadero):
        //   - Accedemos al último usuario registrado con `users[users.length - 1]`.
        //   - Tomamos su ID (`.id`) y le sumamos 1 para obtener un nuevo ID incremental.
        // - Si no hay ningún usuario (el arreglo está vacío):
        //   - Asignamos directamente el ID 1 al primer usuario.
        // Esto garantiza que cada usuario tenga un ID único y consecutivo.
        const newId = users.length ? users[users.length - 1].id + 1 : 1;

        // Creamos el nuevo objeto de usuario con ID, nombre y correo electrónico
        const newUser = { id: newId, name, email };

        // Agregamos el nuevo usuario al arreglo existente
        users.push(newUser);

        // Guardamos (reescribimos) el archivo users.json con la nueva lista de usuarios
        // JSON.stringify(..., null, 2) se usa para dar formato legible al archivo (indentación de 2 espacios).
        await fs.writeFile(userPath, JSON.stringify(users, null, 2));

        // Respondemos con estado 201 (Created) y el usuario que fue creado
        res.status(201).json({ message: 'Usuario creado con éxito', newUser });
    } catch (error) {
        next(error);
    }
}
