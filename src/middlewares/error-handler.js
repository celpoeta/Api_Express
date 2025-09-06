// Middleware de manejo de errores en Express
// Se coloca al final de todas las rutas y middlewares
// Captura cualquier error que ocurra en el flujo de la aplicación
export function errorHandler(error, _req, res, _next) {
    // Mostramos el error en la consola del servidor (útil para depuración)
    console.error("Error");

    // Determinamos el código de estado HTTP:
    // - Si el error trae una propiedad "statusCode", usamos esa.
    // - Si no, usamos 500 por defecto (Internal Server Error).
    const status = error.statusCode || 500;

    // Respondemos al cliente con:
    // - status: el código HTTP correspondiente
    // - un objeto JSON que contiene el mensaje de error
    //   (si no hay mensaje definido, enviamos "Error interno del servidor")
    res.status(status).json({
        error: error.message || "Error interno del servidor"
    });
}
