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

app.post("/api/estudiantes", async (req, res) => {
  const { nombre, apellido, edad, grado, correo } = req.body;

  // Validación mínima
  if (!nombre || !apellido || !edad || !grado) {
    return res.status(400).json({ ok: false, message: "Faltan campos obligatorios" });
  }
  if (Number(edad) <= 0) {
    return res.status(400).json({ ok: false, message: "Edad debe ser > 0" });
  }

  const [result] = await db.query(
    `INSERT INTO estudiantes (nombre, apellido, edad, grado, correo)
     VALUES (?, ?, ?, ?, ?)`,
    [nombre, apellido, edad, grado, correo || null]
  );

  res.status(201).json({ ok: true, id: result.insertId });
});

app.get("/api/estudiantes", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM estudiantes ORDER BY id DESC");
  res.json({ ok: true, data: rows });
});

app.get("/api/estudiantes/:id", async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query("SELECT * FROM estudiantes WHERE id = ?", [id]);

  if (rows.length === 0) return res.status(404).json({ ok: false, message: "No existe" });
  res.json({ ok: true, data: rows[0] });
});

app.put("/api/estudiantes/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, edad, grado, correo } = req.body;

  await db.query(
    `UPDATE estudiantes
     SET nombre=?, apellido=?, edad=?, grado=?, correo=?
     WHERE id=?`,
    [nombre, apellido, edad, grado, correo || null, id]
  );

  res.json({ ok: true });
});

app.patch("/api/estudiantes/:id/asistencia", async (req, res) => {
  const { id } = req.params;
  const { asistencia } = req.body;

  await db.query(
    "UPDATE estudiantes SET asistencia=? WHERE id=?",
    [asistencia ? 1 : 0, id]
  );

  res.json({ ok: true });
});

app.delete("/api/estudiantes/:id", async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM estudiantes WHERE id=?", [id]);
  res.json({ ok: true });
});

// Rutas estudiantes
app.use("/api/estudiantes", estudianteRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => res.send("Educational Control API running 🚀"));

app.get("/api/ping", async (req, res) => {
  const [rows] = await db.query("SELECT 1 as ok");
  res.json({ ok: true, db: rows[0].ok });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));