const express = require("express");
const router = express.Router();
const db = require("../db");

// Obtener notas
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM notas ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener notas" });
  }
});

// Guardar nota
router.post("/", async (req, res) => {
  try {
    const { estudiante, materia, nota1, nota2, nota3 } = req.body;

    const promedio = (nota1 + nota2 + nota3) / 3;

    await db.query(
      "INSERT INTO notas (estudiante, materia, nota1, nota2, nota3, promedio) VALUES (?, ?, ?, ?, ?, ?)",
      [estudiante, materia, nota1, nota2, nota3, promedio]
    );

    res.json({ message: "Nota guardada" });
  } catch (error) {
    res.status(500).json({ message: "Error al guardar" });
  }
});

// Eliminar
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM notas WHERE id = ?", [req.params.id]);
    res.json({ message: "Eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar" });
  }
});

module.exports = router;