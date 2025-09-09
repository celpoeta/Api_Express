// Expresión regular (regex) para validar formato de email.
// Permite letras, números y algunos símbolos antes del @,
// luego un dominio válido, y finalmente una extensión de 2 o más letras (.com, .org, .hn, etc.)
const emailTemplate = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function validateEmail(req, res, next) {
    const email = req.body.email;

    // Si el campo email no existe en el body, simplemente seguimos
    // Esto permite que en PATCH sea opcional.
    if (!email) {
        return next();
    }

    // Validamos que el email tenga un formato correcto usando la expresión regular
    // Ejemplos válidos: test@mail.com, user123@gmail.hn
    // Ejemplos inválidos: test@mail, user@@gmail.com
    if (!emailTemplate.test(email)) {
        return res
            .status(400)
            .json({ error: "email tiene un formato que no es válido" });
    }

    // Si pasa la validación, continuamos al siguiente middleware o controlador
    next();
}