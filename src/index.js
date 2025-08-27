// Importamos las librerías necesarias
import express from 'express';          // Framework de tercero para crear el servidor y manejar rutas HTTP
import fs from 'node:fs/promises';      // Módulo nativo para trabajar con archivos de forma asíncrona usando Promesas
import path from 'node:path';           // Módulo nativo para manejar rutas de archivos y carpetas

// Definimos la ruta del archivo JSON donde tenemos a nuestros usuarios
// OJO: esta es una ruta relativa, funciona siempre que ejecutemos node desde la raíz del proyecto (mas adelante lo haremos mas robusto)
const userPath = path.join('data', 'users.json');

// Creamos la aplicación de Express
const app = express();

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

// ---------------------- LEVANTAR SERVIDOR ---------------------- //

// Iniciamos el servidor en el puerto indicado
// Cuando esté listo, mostramos un mensaje en consola
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});