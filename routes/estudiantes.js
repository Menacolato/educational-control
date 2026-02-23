const express = require("express");
const db = require("../src/config/db");
const router = express.Router();

// ==========================
// ✅ LISTAR estudiantes
// GET /api/estudiantes
// ==========================
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, nombre, apellido, edad, grado, correo, asistencia
       FROM usuarios
       WHERE rol = 'estudiante'
       ORDER BY id DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("GET /api/estudiantes error:", err);
    res.status(500).json({ message: "Error al listar estudiantes" });
  }
});

// ==========================
// ✅ CREAR estudiante
// POST /api/estudiantes
// ==========================
router.post("/", async (req, res) => {
  try {
    const { nombre, apellido, edad, grado, correo } = req.body;

    const [result] = await db.query(
      `INSERT INTO usuarios (nombre, apellido, edad, grado, correo, rol, asistencia)
       VALUES (?, ?, ?, ?, ?, 'estudiante', 0)`,
      [nombre, apellido, edad, grado, correo]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error("POST /api/estudiantes error:", err);
    res.status(500).json({ message: "Error al crear estudiante" });
  }
});

// ==========================
// ✅ EDITAR estudiante
// PUT /api/estudiantes/:id
// ==========================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, edad, grado, correo } = req.body;

    await db.query(
      `UPDATE usuarios
       SET nombre=?, apellido=?, edad=?, grado=?, correo=?
       WHERE id=? AND rol='estudiante'`,
      [nombre, apellido, edad, grado, correo, id]
    );

    res.json({ message: "Actualizado" });
  } catch (err) {
    console.error("PUT /api/estudiantes/:id error:", err);
    res.status(500).json({ message: "Error al actualizar estudiante" });
  }
});

// ==========================
// ✅ ELIMINAR estudiante
// DELETE /api/estudiantes/:id
// ==========================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `DELETE FROM usuarios
       WHERE id=? AND rol='estudiante'`,
      [id]
    );

    res.json({ message: "Eliminado" });
  } catch (err) {
    console.error("DELETE /api/estudiantes/:id error:", err);
    res.status(500).json({ message: "Error al eliminar estudiante" });
  }
});

// ==========================
// ✅ TOGGLE asistencia
// PATCH /api/estudiantes/:id/asistencia
// ==========================
router.patch("/:id/asistencia", async (req, res) => {
  try {
    const { id } = req.params;
    const { asistencia } = req.body;

    await db.query(
      `UPDATE usuarios
       SET asistencia = ?
       WHERE id=? AND rol='estudiante'`,
      [asistencia ? 1 : 0, id]
    );

    res.json({ message: "Asistencia actualizada" });
  } catch (err) {
    console.error("PATCH /api/estudiantes/:id/asistencia error:", err);
    res.status(500).json({ message: "Error al actualizar asistencia" });
  }
});

// ==========================
// ✅ MARCAR/DESMARCAR TODOS
// PATCH /api/estudiantes/asistencia/todos
// ==========================
router.patch("/asistencia/todos", async (req, res) => {
  try {
    const { asistencia } = req.body;

    await db.query(
      `UPDATE usuarios
       SET asistencia = ?
       WHERE rol='estudiante'`,
      [asistencia ? 1 : 0]
    );

    res.json({ message: "Asistencia masiva actualizada" });
  } catch (err) {
    console.error("PATCH /api/estudiantes/asistencia/todos error:", err);
    res.status(500).json({ message: "Error en asistencia masiva" });
  }
});

module.exports = router;