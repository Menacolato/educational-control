const express = require("express");
const router = express.Router();

let estudiantes = [];
let nextId = 1;

router.get("/", (_req, res) => res.json(estudiantes));

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const est = estudiantes.find(e => e.id === id);
  if (!est) return res.status(404).json({ message: "No encontrado" });
  res.json(est);
});

router.post("/", (req, res) => {
  const { nombre, apellido, edad, grado, correo } = req.body;
  if (!nombre || !apellido || !grado) {
    return res.status(400).json({ message: "nombre, apellido y grado requeridos" });
  }
  const nuevo = {
    id: nextId++,
    nombre: String(nombre).trim(),
    apellido: String(apellido).trim(),
    edad: edad === "" || edad === undefined ? null : Number(edad),
    grado: String(grado).trim(),
    correo: correo ? String(correo).trim() : "",
    asistencia: false
  };
  estudiantes.push(nuevo);
  res.status(201).json(nuevo);
});

router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const est = estudiantes.find(e => e.id === id);
  if (!est) return res.status(404).json({ message: "No encontrado" });

  const { nombre, apellido, edad, grado, correo } = req.body;
  if (nombre !== undefined) est.nombre = String(nombre).trim();
  if (apellido !== undefined) est.apellido = String(apellido).trim();
  if (edad !== undefined) est.edad = edad === "" ? null : Number(edad);
  if (grado !== undefined) est.grado = String(grado).trim();
  if (correo !== undefined) est.correo = String(correo).trim();

  res.json(est);
});

router.patch("/:id/asistencia", (req, res) => {
  const id = Number(req.params.id);
  const est = estudiantes.find(e => e.id === id);
  if (!est) return res.status(404).json({ message: "No encontrado" });

  est.asistencia = Boolean(req.body.asistencia);
  res.json(est);
});

router.patch("/asistencia/todos", (req, res) => {
  const valor = Boolean(req.body.asistencia);
  estudiantes = estudiantes.map(e => ({ ...e, asistencia: valor }));
  res.json({ ok: true });
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = estudiantes.length;
  estudiantes = estudiantes.filter(e => e.id !== id);
  if (estudiantes.length === before) return res.status(404).json({ message: "No encontrado" });
  res.json({ ok: true });
});

module.exports = router;