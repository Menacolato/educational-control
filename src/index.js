require("dotenv").config(); // CARGA .env al inicio

const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./db"); // IMPORTA db antes de usarlo
const estudiantesRoutes = require("./routes/estudiantes.routes");

const app = express();

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

// DB test
app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 as ok");
    res.json({ ok: true, rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Rutas estudiantes (CRUD está dentro del archivo routes)
app.use("/api/estudiantes", estudiantesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});