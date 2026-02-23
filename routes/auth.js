const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db");


// =========================
// REGISTRO
// =========================
router.post("/register", async (req, res) => {

    const {
        nombre,
        correo,
        password,
        rol,
        grado,
        seccion,
        turno,
        materia_principal,
        telefono,
        codigo_admin
    } = req.body;

    if (!nombre || !correo || !password || !rol) {
        return res.status(400).json({ message: "Faltan datos básicos" });
    }

    db.query("SELECT * FROM usuarios WHERE correo = ?", [correo], async (err, results) => {
        if (err) return res.status(500).json({ message: "Error servidor" });
        if (results.length > 0)
            return res.status(400).json({ message: "Correo ya registrado" });

        const hashedPassword = await bcrypt.hash(password, 10);

        // ===== DOCENTE =====
        if (rol === "docente") {

            db.query(
                `INSERT INTO usuarios (nombre, correo, password, rol)
                 VALUES (?, ?, ?, 'docente')`,
                [nombre, correo, hashedPassword],
                (err) => {
                    if (err) return res.status(500).json({ message: "Error al crear docente" });
                    res.json({ message: "Docente registrado correctamente" });
                }
            );
        }

        // ===== ESTUDIANTE =====
        else if (rol === "estudiante") {

            db.query(
                `INSERT INTO usuarios (nombre, correo, password, rol)
                 VALUES (?, ?, ?, 'estudiante')`,
                [nombre, correo, hashedPassword],
                (err) => {
                    if (err) return res.status(500).json({ message: "Error al crear estudiante" });
                    res.json({ message: "Estudiante registrado correctamente" });
                }
            );
        }

        // ===== ADMIN =====
        else if (rol === "admin") {

            if (codigo_admin !== "12345")
                return res.status(403).json({ message: "Código admin incorrecto" });

            db.query(
                `INSERT INTO usuarios (nombre, correo, password, rol)
                 VALUES (?, ?, ?, 'admin')`,
                [nombre, correo, hashedPassword],
                (err) => {
                    if (err) return res.status(500).json({ message: "Error al crear admin" });
                    res.json({ message: "Administrador registrado correctamente" });
                }
            );
        }

        else {
            return res.status(400).json({ message: "Rol inválido" });
        }

    });
});


// =========================
// LOGIN (ESTO TE FALTABA)
// =========================
router.post("/login", (req, res) => {

    const { correo, password } = req.body;

    if (!correo || !password) {
        return res.status(400).json({ message: "Faltan datos" });
    }

    db.query("SELECT * FROM usuarios WHERE correo = ?", [correo], async (err, results) => {

        if (err) return res.status(500).json({ message: "Error servidor" });

        if (results.length === 0) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        const usuario = results[0];

        const coincide = await bcrypt.compare(password, usuario.password);

        if (!coincide) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        // Guardamos sesión
        req.session.usuario = {
            id: usuario.id,
            nombre: usuario.nombre,
            rol: usuario.rol
        };

        res.json({ message: "Login correcto", rol: usuario.rol });
    });

});

module.exports = router;