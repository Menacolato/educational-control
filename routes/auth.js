const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");


// ============================
// REGISTRO
// ============================
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
        return res.status(400).json({ error: "Campos obligatorios faltantes" });
    }

    // 🔐 Si intenta crear admin
    if (rol === "admin") {
        if (codigo_admin !== "ADMIN2026") {
            return res.status(403).json({ error: "Código de administrador incorrecto" });
        }
    }

    if (password.length < 6) {
        return res.status(400).json({ error: "La contraseña debe tener mínimo 6 caracteres" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
        `INSERT INTO usuarios
        (nombre, correo, password, rol, grado, seccion, turno, materia_principal, telefono)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            nombre,
            correo,
            hashedPassword,
            rol,
            grado || null,
            seccion || null,
            turno || null,
            materia_principal || null,
            telefono || null
        ],
        (err) => {
            if (err) {
                return res.status(500).json({ error: "El correo ya existe" });
            }
            res.json({ message: "Usuario creado correctamente" });
        }
    );
});

// ============================
// LOGIN
// ============================
router.post("/login", (req, res) => {

    const { correo, password } = req.body;

    db.query("SELECT * FROM usuarios WHERE correo = ?", [correo], async (err, results) => {

        if (err) {
            return res.status(500).json({ error: "Error en servidor" });
        }

        if (results.length === 0) {
            return res.status(400).json({ error: "Usuario no encontrado" });
        }

        const user = results[0];

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }

        // 🔥 AQUÍ GUARDAMOS SESIÓN
        req.session.usuario = {
            id: user.id,
            nombre: user.nombre,
            rol: user.rol
        };

        res.json({
            message: "Login exitoso",
            rol: user.rol
        });
    });
});


module.exports = router;