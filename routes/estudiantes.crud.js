// routes/estudiantes.crud.js
const express = require("express");
const db = require("../src/config/db");
const router = express.Router();

// GET /api/estudiantes
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, nombre, apellido, edad, grado, correo, asistencia FROM estudiantes ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("GET /estudiantes error:", err);
    res.status(500).json({ message: "Error consultando estudiantes" });
  }
});

// GET /api/estudiantes/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      "SELECT id, nombre, apellido, edad, grado, correo, asistencia FROM estudiantes WHERE id = ?",
      [id]
    );
    res.json(rows[0] || null);
  } catch (err) {
    console.error("GET /estudiantes/:id error:", err);
    res.status(500).json({ message: "Error consultando estudiante" });
  }
});

// POST /api/estudiantes
router.post("/", async (req, res) => {
  try {
    const { nombre, apellido, edad, grado, correo } = req.body;

    const [result] = await db.query(
      "INSERT INTO estudiantes (nombre, apellido, edad, grado, correo, asistencia) VALUES (?, ?, ?, ?, ?, 0)",
      [nombre, apellido, edad, grado, correo]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error("POST /estudiantes error:", err);
    res.status(500).json({ message: "Error creando estudiante" });
  }
});

// PUT /api/estudiantes/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, edad, grado, correo } = req.body;

    await db.query(
      "UPDATE estudiantes SET nombre=?, apellido=?, edad=?, grado=?, correo=? WHERE id=?",
      [nombre, apellido, edad, grado, correo, id]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("PUT /estudiantes/:id error:", err);
    res.status(500).json({ message: "Error actualizando estudiante" });
  }
});

// DELETE /api/estudiantes/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM estudiantes WHERE id=?", [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /estudiantes/:id error:", err);
    res.status(500).json({ message: "Error eliminando estudiante" });
  }
});

// PATCH /api/estudiantes/:id/asistencia
router.patch("/:id/asistencia", async (req, res) => {
  try {
    const { id } = req.params;
    const { asistencia } = req.body;

    await db.query(
      "UPDATE estudiantes SET asistencia=? WHERE id=?",
      [asistencia ? 1 : 0, id]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("PATCH /estudiantes/:id/asistencia error:", err);
    res.status(500).json({ message: "Error actualizando asistencia" });
  }
});

// PATCH /api/estudiantes/asistencia/todos
router.patch("/asistencia/todos", async (req, res) => {
  try {
    const { asistencia } = req.body;
    await db.query("UPDATE estudiantes SET asistencia=?", [asistencia ? 1 : 0]);
    res.json({ ok: true });
  } catch (err) {
    console.error("PATCH /estudiantes/asistencia/todos error:", err);
    res.status(500).json({ message: "Error actualizando asistencia masiva" });
  }
});

module.exports = router;