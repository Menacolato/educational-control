const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesión
app.use(session({
    secret: "secreto123",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000*60*60 } // 1 hora
}));

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rutas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/docente", require("./routes/docente"));

app.listen(3000, () => console.log("Servidor en puerto 3000"));