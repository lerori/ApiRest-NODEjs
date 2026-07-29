require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();

// La cadena de conexión y el puerto ahora se leen del .env (nunca hardcodeados)
const DB_ADDRESS = process.env.DB_ADDRESS;
const PORT = process.env.PORT || 3100;

if (!DB_ADDRESS) {
  console.error("Falta la variable de entorno DB_ADDRESS (ver .env.example)");
  process.exit(1);
}

// Cabeceras de seguridad HTTP
app.use(helmet());

// CORS: restringir orígenes mediante CORS_ORIGIN en producción
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*"
  })
);

// Límite de peticiones para mitigar fuerza bruta / DoS básicos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Parseo de body (Express 5 ya no requiere el paquete body-parser)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
const tRouter = require("./routes/taskRouter");
app.use("/api/tasks", tRouter);

// 404 para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Recurso no encontrado" });
});

// Middleware centralizado de manejo de errores
app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: "Datos inválidos", details: err.message });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Identificador inválido" });
  }

  res.status(500).json({ error: "Error interno del servidor" });
});

let server;

mongoose
  .connect(DB_ADDRESS)
  .then(() => {
    console.log("Conexión a la base de datos exitosa");
    server = app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("Error al conectar a la base de datos:", err);
    process.exit(1);
  });

// Apagado ordenado (cierra conexiones al recibir señales del sistema/orquestador)
const shutdown = async () => {
  console.log("Apagando servidor...");
  if (server) server.close();
  await mongoose.disconnect();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

module.exports = app;
