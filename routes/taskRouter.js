const express = require("express");
const Task = require("../models/taskModel");

const taskRouter = express.Router();

// Campos permitidos desde el cliente (evita mass assignment sobre _id, created_at, updated_at, etc.)
const ALLOWED_FIELDS = ["title", "description", "due_date", "completed"];

function pickAllowedFields(body) {
  const data = {};
  for (const field of ALLOWED_FIELDS) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  return data;
}

taskRouter
  .route("/")
  // Obtener todas las tareas
  .get(async (req, res) => {
    const tasks = await Task.find({});
    res.json(tasks);
  })
  // Crear una tarea
  .post(async (req, res) => {
    const task = new Task(pickAllowedFields(req.body));
    await task.save();
    res.status(201).json(task);
  });

// Middleware: busca la tarea por id; responde 404 si no existe.
// Los ids con formato inválido lanzan CastError y son manejados por el
// middleware de errores central en server.js (Express 5 reenvía automáticamente
// los rechazos de promesas de handlers async).
taskRouter.use("/:taskId", async (req, res, next) => {
  const task = await Task.findById(req.params.taskId);
  if (!task) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }
  req.task = task;
  next();
});

taskRouter
  .route("/:taskId")
  .get((req, res) => {
    res.json(req.task);
  })
  // Reemplazar la tarea
  .put(async (req, res) => {
    Object.assign(req.task, pickAllowedFields(req.body));
    await req.task.save();
    res.json(req.task);
  })
  // Actualizar campos parciales de la tarea
  .patch(async (req, res) => {
    Object.assign(req.task, pickAllowedFields(req.body));
    await req.task.save();
    res.json(req.task);
  })
  // Eliminar la tarea
  .delete(async (req, res) => {
    await req.task.deleteOne();
    res.status(204).end();
  });

module.exports = taskRouter;
