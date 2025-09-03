// Importamos las librerías necesarias
import express from 'express';          // Framework de tercero para crear el servidor y manejar rutas HTTP
import fs from 'node:fs/promises';      // Módulo nativo para trabajar con archivos de forma asíncrona usando Promesas
import path from 'node:path';           // Módulo nativo para manejar rutas de archivos y carpetas

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

// Ruta GET /api/users
// Objetivo: devolver todos los usuarios guardados en users.json
app.get('/api/users', async (_req, res) => {
    try {
        // Leemos el archivo users.json como texto con codificación utf8
        const data = await fs.readFile(userPath, 'utf8');

        // Convertimos el texto JSON a un arreglo de objetos JavaScript
        const users = JSON.parse(data);

        // Cuando queremos responderle al cliente usamos "res."
        //    - "json(...)" envía un objeto JSON al cliente como respuesta.
        res.json(users);
    } catch (error) {
        // Si ocurre un error (archivo no existe, JSON mal formado, etc.)
        console.error('Error al leer el archivo');
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta GET /api/users/:id
// Objetivo: devolver un usuario en específico buscando por su id
app.get('/api/users/:id', async (req, res) => {
    try {
        // Leemos el archivo users.json
        const data = await fs.readFile(userPath, 'utf8');

        // Parseamos el contenido a un arreglo de usuarios
        const users = JSON.parse(data);

        // Obtenemos el parámetro id de la URL y lo convertimos a número
        const userId = Number(req.params.id);

        // Validamos si el parámetro id es un numero entero y mayor que 0, de lo contrario no es un valor valido
        if (!Number.isInteger(userId) || userId < 1) {
            return res.status(400).json({ error: 'El parámetro id deber ser un entero mayor a 0' });
        }

        // Usamos el método .find() del array:
        // Este método recorre el arreglo y devuelve el PRIMER elemento que cumpla la condición indicada.
        // En este caso, buscamos el usuario cuyo id sea igual al userId recibido en la URL.
        const user = users.find(user => user.id === userId);

        // Si no lo encontramos, devolvemos un error 404
        // Cuando queremos responderle al cliente usamos "res."
        //    - "status(404)" indica el código HTTP de la respuesta (en este caso 404 = No encontrado).
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Si lo encontramos, devolvemos el objeto usuario
        // Cuando queremos responderle al cliente usamos "res."
        //    - "json(...)" envía un objeto JSON al cliente como respuesta.
        res.json(user);
    } catch (error) {
        // Capturamos cualquier error al leer el archivo
        console.error('Error al leer el archivo');
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta POST /api/users
// Objetivo: crear un nuevo usuario y guardarlo en el archivo users.json
app.post('/api/users', async (req, res) => {
    try {
        // Extraemos los datos enviados por el cliente desde el body (name y email)
        // Notas:
        // - 'name' se toma directamente.
        // - 'email' se convierte a minúsculas para evitar duplicados por mayúsculas/minúsculas.
        const name = req.body.name;
        const email = req.body.email.toLowerCase();

        // Leemos el archivo users.json
        const data = await fs.readFile(userPath, 'utf8');

        // Parseamos el contenido a un arreglo de usuarios
        const users = JSON.parse(data);

        // Verificamos si ya existe un usuario con el mismo email en la lista
        // 'some' recorre el arreglo y devuelve true si encuentra coincidencia.
        const emailExists = users.some(user => user.email === email);

        // Si el email ya está registrado, se retorna un error 409 (Conflict)
        if (emailExists) {
            return res.status(409).json({ error: 'El email ya esta registrado' });
        }

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
        // Si ocurre un error en cualquier parte del proceso (leer o escribir el archivo), lo capturamos aquí
        console.error('Error al leer o escribir en el archivo');

        // Enviamos una respuesta de error 500 (Internal Server Error)
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Ruta PUT /api/users/:id
// Objetivo: reemplazar COMPLETAMENTE un usuario existente en el archivo users.json
app.put('/api/users/:id', async (req, res) => {
    try {
        // Obtenemos el parámetro id de la URL y lo convertimos a número
        const userId = Number(req.params.id);

        // Extraemos los datos enviados por el cliente desde el body
        // Notas:
        // - 'name' se toma directamente.
        // - 'email' se convierte a minúsculas para evitar duplicados por mayúsculas/minúsculas.
        const name = req.body.name;
        const email = req.body.email.toLowerCase();

        // Validamos que los campos obligatorios existan
        // PUT exige que vengan todos los campos necesarios
        if (!name || !email) {
            return res.status(400).json({ error: 'name y email son requeridos para actualizar' });
        }

        // Leemos el archivo users.json como texto
        const data = await fs.readFile(userPath, 'utf8');

        // Parseamos el contenido a un arreglo de usuarios
        const users = JSON.parse(data);

        // Buscamos el índice del usuario cuyo id coincida con userId
        const userIndex = users.findIndex(user => user.id === userId);

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
        // Si ocurre un error en cualquier parte del proceso (leer/escribir archivo, JSON inválido, etc.)
        console.error('Error al leer el archivo desde el PUT');
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Ruta PATCH /api/users/:id
// Objetivo: actualizar SOLO algunos campos de un usuario existente en el archivo users.json
app.patch('/api/users/:id', async (req, res) => {
    try {
        // Obtenemos el parámetro id de la URL y lo convertimos a número
        const userId = Number(req.params.id);

        // Extraemos los datos enviados por el cliente en el body (opcionales en PATCH)
        const name = req.body.name;
        const email = req.body.email;

        // Validamos que al menos se envíe un campo
        if (!name && !email) {
            return res.status(400).json({ error: 'Debe enviar al menos un campo para actualizar (name o email)' });
        }

        // Leemos el archivo users.json como texto
        const data = await fs.readFile(userPath, 'utf8');

        // Parseamos el contenido a un arreglo de usuarios
        const users = JSON.parse(data);

        // Buscamos al usuario cuyo id coincida con userId
        const user = users.find(user => user.id === userId);

        // Si no existe, devolvemos error 404
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // IMPORTANTE:
        // "user" no es una copia, sino una REFERENCIA al objeto dentro del arreglo "users".
        // Por lo tanto, si modificamos "user", también se modifica el arreglo "users".
        // Ejemplo:
        //   user.name = "Nuevo"  →  users ya tiene ese cambio internamente.
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
        // Si ocurre un error en cualquier parte del proceso (leer/escribir archivo, JSON inválido, etc.)
        console.error('Error al leer el archivo desde el PATCH');
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ---------------------- LEVANTAR SERVIDOR ---------------------- //

// Iniciamos el servidor en el puerto indicado
// Cuando esté listo, mostramos un mensaje en consola
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});