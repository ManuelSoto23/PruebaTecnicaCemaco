const jwt = require("jsonwebtoken");
const { getConnection, sql } = require("../config/database");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token de acceso requerido" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const pool = await getConnection();
    const request = pool.request();
    request.input("userId", sql.Int, decoded.userId);

    const result = await request.query(`
      SELECT Id, Username, Email, Role 
      FROM Users 
      WHERE Id = @userId
    `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    req.user = {
      id: result.recordset[0].Id,
      username: result.recordset[0].Username,
      email: result.recordset[0].Email,
      role: result.recordset[0].Role,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Token inválido" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Token expirado" });
    }
    return res.status(500).json({ message: "Error en autenticación" });
  }
};

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "No tiene permisos para realizar esta acción" });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole,
};
