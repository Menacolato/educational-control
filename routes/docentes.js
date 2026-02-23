const express = require("express");
const db = require("../db");
const router = express.Router();


// 🔐 Middleware docente
function verificarDocente(req, res, next) {

    if (!req.session.usuario) {
        return res.status(401).json({ message: "No autenticado" });
    }

    if (req.session.usuario.rol !== "docente") {
        return res.status(403).json({ message: "No autorizado" });
    }

    next();
}


// ==========================
// 📚 MIS MATERIAS
// ==========================
router.get("/mis-materias", verificarDocente, (req, res) => {

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


// ==========================
// 👥 VER ESTUDIANTES POR MATERIA
// ==========================
router.get("/estudiantes/:id", verificarDocente, (req, res) => {

    const docente_materia_id = req.params.id;

    db.query(
        `SELECT u.id, u.nombre
         FROM docente_materias dm
         JOIN usuarios u 
           ON u.grado = dm.grado AND u.seccion = dm.seccion
         WHERE dm.id = ? AND u.rol = 'estudiante'`,
        [docente_materia_id],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        }
    );
});


// ==========================
// 📝 CREAR TAREA
// ==========================
router.post("/crear-tarea", verificarDocente, (req, res) => {

    const { docente_materia_id, titulo, descripcion, fecha_entrega, valor } = req.body;

    db.query(
        "INSERT INTO tareas (docente_materia_id,titulo,descripcion,fecha_entrega,valor) VALUES (?,?,?,?,?)",
        [docente_materia_id, titulo, descripcion, fecha_entrega, valor],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Tarea creada correctamente" });
        }
    );
});


// ==========================
// 📊 REGISTRAR NOTA
// ==========================
router.post("/registrar-nota", verificarDocente, (req, res) => {

    const { tarea_id, estudiante_id, nota } = req.body;

    db.query(
        "INSERT INTO notas_tareas (tarea_id, estudiante_id, nota) VALUES (?,?,?)",
        [tarea_id, estudiante_id, nota],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Nota registrada correctamente" });
        }
    );
});

module.exports = router;