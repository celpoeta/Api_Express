// Middleware: valida que en una petición PATCH se envíe al menos un campo (name o email)
export function validatePatchUser(req, res, next) {
    // Extraemos los campos "name" y "email" del body.
    // Si req.body no existe, usamos un objeto vacío {} para evitar errores.
    const { name, email } = req.body || {};

    // Verificamos si "name" existe y no está vacío:
    // 1) Debe ser tipo string
    // 2) Luego de eliminar espacios .trim(), no debe quedar vacío
    const hasName = typeof name === 'string' && name.trim() !== '';

    // Verificamos si "email" existe y no está vacío (mismas condiciones que name)
    const hasEmail = typeof email === 'string' && email.trim() !== '';

    // Si NO hay "name" ni "email", la petición no tiene nada que actualizar
    // → Respondemos con error 400 (Bad Request)
    if (!hasName && !hasEmail) {
        return res.status(400).json({
            error: 'Debe enviar al menos un campo (name o email)'
        });
    }
    next();
}