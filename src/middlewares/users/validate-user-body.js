// Expresión regular (regex) para validar formato de email.
// Permite letras, números y algunos símbolos antes del @,
// luego un dominio válido, y finalmente una extensión de 2 o más letras (.com, .org, .hn, etc.)
const emailTemplate = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Middleware: valida que el body de la petición tenga un "name" y un "email" válidos
export function validateUserBody(req, res, next) {
    // Extraemos los datos enviados por el cliente desde el body
    // "name" se toma tal cual, "email" lo validaremos con regex
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

    // Validamos que el email tenga un formato correcto usando la expresión regular
    // Ejemplos válidos: test@mail.com, user123@gmail.hn
    // Ejemplos inválidos: test@mail, user@@gmail.com
    if (!emailTemplate.test(email)) {
        return res
            .status(400)
            .json({ error: "email tiene un formato que no es valido" });
    }

    // Si pasó todas las validaciones, continuamos al siguiente middleware o controller
    next();
}
