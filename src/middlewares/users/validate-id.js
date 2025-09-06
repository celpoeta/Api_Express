// Middleware: valida que el parámetro "id" de la URL sea un número entero válido
export function validateId(req, res, next) {
    // Extraemos el parámetro "id" de la URL y lo convertimos a número
    // Ejemplo: si la URL es /api/users/5 → req.params.id = "5" (string)
    //          con Number() lo transformamos a 5 (number)
    const userId = Number(req.params.id);

    // Validamos que:
    // 1) userId sea un número entero (no decimal, no NaN)
    // 2) userId sea mayor a 0 (no aceptamos 0 o negativos)
    if (!Number.isInteger(userId) || userId < 1) {
        return res
            .status(400) // 400 = Bad Request
            .json({ error: "El parámetro id debe ser un entero mayor a 0" });
    }

    // Si es válido, reemplazamos req.params.id con el número ya convertido
    // Así en los controllers no tenemos que volver a hacer la conversión
    req.params.id = userId;

    // Pasamos al siguiente middleware o controller
    next();
}
