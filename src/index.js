const express = require("express");
const cors = require("cors");
const path = require("path"); // ¡No olvides importar path!
const estudianteRoutes = require("./routes/estudiante.routes");

const app = express(); // <- primero app

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "../public"))); 

// Health check
app.get("/", (req, res) => {
  res.send("Educational Control API running 🚀");
});

// Ping
app.get("/api/ping", (req, res) => {
  res.json({ ok: true, message: "pong" });
});

// Rutas estudiantes
app.use("/api/estudiantes", estudianteRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
