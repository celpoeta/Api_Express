// Middleware: valida que el body de la petición tenga un "name" y un "email" válidos
export function validateUserBody(req, res, next) {
    // Extraemos los datos enviados por el cliente desde el body
    const name = req.body.name;
    const email = req.body.email;

    // Validamos que los campos obligatorios existan
    // Nota: este middleware es ideal para PUT y POST,
    // porque ambos requieren que se envíen todos los campos necesarios
    if (!name || !email) {
        return res
            .status(400) // 400 = Bad Request (la petición no cumple con lo esperado)
            .json({ error: "name y email son requeridos para actualizar" });
    }
    // Si pasó todas las validaciones, continuamos al siguiente middleware o controller
    next();
}
