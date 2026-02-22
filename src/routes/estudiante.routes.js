const express = require("express");
const router = express.Router();
const db = require("../config/db");


// ==============================
// CREATE
// ==============================
router.post("/", (req, res) => {
    const { nombre, apellido, edad, grado, correo } = req.body;

    const sql = `
        INSERT INTO estudiante (nombre, apellido, edad, grado, correo, asistencia) 
        VALUES (?, ?, ?, ?, ?, 0)
    `;

    db.query(sql, [nombre, apellido, edad, grado, correo], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Estudiante agregado correctamente" });
    });
});


// ==============================
// READ
// ==============================
router.get("/", (req, res) => {
    db.query("SELECT * FROM estudiante", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});


// ==============================
// UPDATE COMPLETO
// ==============================
router.put("/:id", (req, res) => {
    const { nombre, apellido, edad, grado, correo } = req.body;

    const sql = `
        UPDATE estudiante 
        SET nombre=?, apellido=?, edad=?, grado=?, correo=?
        WHERE id=?
    `;

    db.query(sql, [nombre, apellido, edad, grado, correo, req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Estudiante actualizado correctamente" });
    });
});


// ==============================
// 🔥 MARCAR / DESMARCAR TODOS
// (VA ANTES del :id/asistencia)
// ==============================
router.patch("/asistencia/todos", (req, res) => {
    const { asistencia } = req.body;

    const sql = "UPDATE estudiante SET asistencia=?";

    db.query(sql, [asistencia ? 1 : 0], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Asistencia actualizada para todos" });
    });
});


// ==============================
// PATCH SOLO ASISTENCIA
// ==============================
router.patch("/:id/asistencia", (req, res) => {
    const { asistencia } = req.body;

    const sql = "UPDATE estudiante SET asistencia=? WHERE id=?";

    db.query(sql, [asistencia ? 1 : 0, req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Asistencia actualizada correctamente" });
    });
});


// ==============================
// DELETE
// ==============================
router.delete("/:id", (req, res) => {
    db.query("DELETE FROM estudiante WHERE id=?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Estudiante eliminado" });
        });
});

module.exports = router;