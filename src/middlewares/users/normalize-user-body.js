// Middleware: normaliza los datos enviados en el body (name y email)
// Objetivo: limpiar espacios extra y asegurar que el email esté siempre en minúsculas
export function normalizeUserBody(req, _res, next) {

    // Si el campo "name" existe y es una cadena de texto
    if (typeof req.body.name === "string") {
        // Eliminamos espacios al inicio y al final
        // Ejemplo: "  Juan  " → "Juan"
        req.body.name = req.body.name.trim();
    }

    // Si el campo "email" existe y es una cadena de texto
    if (typeof req.body.email === "string") {
        // 1) Eliminamos espacios al inicio y al final
        // 2) Convertimos todo a minúsculas para evitar duplicados por mayúsculas/minúsculas
        // Ejemplo: " TEST@Mail.COM " → "test@mail.com"
        req.body.email = req.body.email.trim().toLowerCase();
    }

    // Llamamos a next() para que continúe con el siguiente middleware o controller
    next();
}