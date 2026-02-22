const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");

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

    if (rol === "admin") {
        if (codigo_admin !== "123456") {
            return res.status(400).json({ message: "Código admin incorrecto" });
        }
    }

    try {
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
                rol === "estudiante" ? grado : null,
                rol === "estudiante" ? seccion : null,
                rol === "estudiante" ? turno : null,
                rol === "docente" ? materia_principal : null,
                rol === "docente" ? telefono : null
            ],
            (err) => {

                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: "Error al registrar" });
                }

                res.json({ message: "Usuario registrado correctamente" });
            }
        );

    } catch (error) {
        res.status(500).json({ message: "Error al encriptar contraseña" });
    }
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