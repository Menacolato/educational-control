const express = require("express");
const db = require("../db");
const router = express.Router();

// Ver materias del docente logueado
router.get("/mis-materias", (req, res) => {

    const docente_id = req.session.usuario.id;

    db.query(
        `SELECT dm.id, m.nombre, dm.grado, dm.seccion
         FROM docente_materias dm
         JOIN materias m ON dm.materia_id = m.id
         WHERE dm.docente_id = ?`,
        [docente_id],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        }
    );
});

// Crear tarea
router.post("/crear-tarea", (req, res) => {

    const { docente_materia_id, titulo, descripcion, fecha_entrega, valor } = req.body;

    db.query(
        "INSERT INTO tareas (docente_materia_id,titulo,descripcion,fecha_entrega,valor) VALUES (?,?,?,?,?)",
        [docente_materia_id, titulo, descripcion, fecha_entrega, valor],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Tarea creada" });
        }
    );
});

module.exports = router;