const express = require("express");
const router = express.Router();
const db = require("../config/db");

// CREATE
router.post("/", (req, res) => {
    const { nombre, apellido, edad, grado, correo } = req.body;

    const sql = "INSERT INTO estudiante (nombre, apellido, edad, grado, correo) VALUES (?, ?, ?, ?, ?)";

    db.query(sql, [nombre, apellido, edad, grado, correo], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Estudiante agregado correctamente" });
    });
});

// READ
router.get("/", (req, res) => {
    db.query("SELECT * FROM estudiante", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// UPDATE estudiante completo
router.put("/:id", (req, res) => {
    const { nombre, apellido, edad, grado, correo, asistencia } = req.body;

    const sql = `
        UPDATE estudiante 
        SET nombre=?, apellido=?, edad=?, grado=?, correo=?, asistencia=COALESCE(?, asistencia)
        WHERE id=?
    `;

    db.query(sql, [nombre, apellido, edad, grado, correo, asistencia, req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Estudiante actualizado correctamente" });
    });
});

// DELETE
router.delete("/:id", (req, res) => {
    db.query("DELETE FROM estudiante WHERE id=?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Estudiante eliminado" });
        });
});

module.exports = router;