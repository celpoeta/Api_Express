import fs from 'node:fs/promises';
import path from "node:path";

// Middleware: valida que el email de un usuario sea único (no repetido en users.json)
export async function ensureUniqueEmail(req, res, next) {
    try {
        // Extraemos el campo "email" del body de la petición
        // Si el body no existe (ej: body vacío en PATCH), desestructuramos un objeto vacío {}
        const { email } = req.body || {};

        // Si no hay email en la petición, pasamos al siguiente middleware o controller
        // (esto es válido en PATCH, porque puede que solo quieran cambiar el "name")
        if (!email) return next();

        // Construimos la ruta absoluta hacia el archivo "users.json"
        const usersPath = path.join("data", "users.json");

        // Leemos el contenido del archivo users.json como texto
        const text = await fs.readFile(usersPath, 'utf8');

        // Convertimos el texto leído a un arreglo de objetos (usuarios)
        const users = JSON.parse(text);

        // Obtenemos el id de la URL (si lo hay) y lo convertimos a número
        // Esto es útil en PUT/PATCH, para no comparar el email del mismo usuario que estamos actualizando
        const reqId = Number(req.params.id);

        // Verificamos si ya existe un usuario con el mismo email en la lista
        // .some() recorre el arreglo y devuelve true si encuentra un usuario con:
        //   - el mismo email que el enviado en la petición
        //   - y que NO sea el usuario que estamos actualizando (u.id !== reqId)
        const duplicate = users.some(u => u.email === email && u.id !== reqId);

        // Si encontramos un duplicado, respondemos con error 409 (Conflict)
        // 409 se usa cuando la petición entra en conflicto con el estado actual del recurso
        if (duplicate) {
            return res.status(409).json({ error: 'El email ya está registrado' });
        }

        // Si todo está bien (no hay duplicado), pasamos al siguiente middleware o controller
        next();
    } catch (err) {
        // Si ocurre un error al leer el archivo o procesar la validación,
        // lo enviamos al manejador de errores global (errorHandler)
        next(err);
    }
}