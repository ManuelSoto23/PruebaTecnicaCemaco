const errorHandler = (err, req, res, next) => {
  console.error("Error:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || "Error interno del servidor";

  if (err.number === 2627) {
    statusCode = 400;
    message = "El SKU ya existe";
  } else if (err.number === 515) {
    statusCode = 400;
    message = "Campos requeridos faltantes";
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 403;
    message = "Token inválido";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 403;
    message = "Token expirado";
  }

  const errorResponse = {
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      error: err,
    }),
  };

  res.status(statusCode).json(errorResponse);
};

const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: `Ruta ${req.method} ${req.path} no encontrada`,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
