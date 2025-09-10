import { readUsers, writeUsers } from '../utils/userFile.js';

export async function list() {
    return await readUsers();
}

export async function get(id) {
    const users = await readUsers();
    // Usamos el método .find() del array:
    // Este método recorre el arreglo y devuelve el PRIMER elemento que cumpla la condición indicada.
    // En este caso, buscamos el usuario cuyo id sea igual al userId recibido en la URL.
    return users.find((user) => user.id === id);
}

export async function create({ name, email }) {
    const users = await readUsers();

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

    await writeUsers(users);

    return newUser;
}

export async function replace(userId, { name, email }) {
    const users = await readUsers();
    // Buscamos el índice del usuario cuyo id coincida con userId
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
        return null;
    }

    // Reemplazamos completamente el objeto del usuario
    users[userIndex] = { id: userId, name, email };

    await writeUsers(users);

    return users[userIndex];
}