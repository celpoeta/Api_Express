import fs from 'node:fs/promises';
import { userPath } from './paths.js';

// Leemos el archivo users.json como texto con codificación utf8
export async function readUsers() {
    const data = await fs.readFile(userPath, 'utf8');

    return JSON.parse(data);
}

// Guardamos (reescribimos) el archivo users.json con la nueva lista de usuarios
// JSON.stringify(..., null, 2) se usa para dar formato legible al archivo (indentación de 2 espacios).
export async function writeUsers(users) {
    await fs.writeFile(userPath, JSON.stringify(users, null, 2));
}