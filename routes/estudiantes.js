const express = require("express");

// ✅ Usa el pool (mysql2/promise) desde src/config/db.js
// Ajusta esta ruta si tu archivo db está en otro lugar.
const db = require("../src/config/db");

const router = express.Router();

// 🔐 Middleware para estudiante
function verificarEstudiante(req, res, next) {
  if (!req.session || !req.session.usuario) {
    return res.status(401).json({ message: "No autenticado" });
  }

  if (req.session.usuario.rol !== "estudiante") {
    return res.status(403).json({ message: "No autorizado" });
  }

  next();
}

// ==========================
// 📊 DASHBOARD
// ==========================
router.get("/dashboard", verificarEstudiante, async (req, res) => {
  try {
    const estudiante_id = req.session.usuario.id;

    const [rows] = await db.query(
      "SELECT nombre, grado, seccion, turno FROM usuarios WHERE id = ?",
      [estudiante_id]
    );

    res.json(rows[0] || null);
  } catch (err) {
    console.error("Error /dashboard:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// ==========================
// 📚 MIS MATERIAS
// ==========================
router.get("/mis-materias", verificarEstudiante, async (req, res) => {
  try {
    const estudiante_id = req.session.usuario.id;

    const [rows] = await db.query(
      `SELECT m.nombre
       FROM usuarios u
       JOIN docente_materias dm
         ON u.grado = dm.grado AND u.seccion = dm.seccion
       JOIN materias m
         ON dm.materia_id = m.id
       WHERE u.id = ?`,
      [estudiante_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error /mis-materias:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// ==========================
// 📝 MIS NOTAS
// ==========================
router.get("/mis-notas", verificarEstudiante, async (req, res) => {
  try {
    const estudiante_id = req.session.usuario.id;

    const [rows] = await db.query(
      `SELECT t.titulo, nt.nota, t.valor
       FROM notas_tareas nt
       JOIN tareas t ON nt.tarea_id = t.id
       WHERE nt.estudiante_id = ?`,
      [estudiante_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error /mis-notas:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

module.exports = router;