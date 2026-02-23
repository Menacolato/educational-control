const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("trust proxy", 1); // recomendado en Cloud Run

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secreto123",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // si luego pones HTTPS + proxy, se puede ajustar
    },
  })
);

// ✅ Sirve los HTML/CSS/JS
app.use(express.static(path.join(__dirname, "public")));

// ✅ APIs
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/docente", require("./routes/docente"));

// 👇 separación correcta
app.use("/api/estudiantes", require("./routes/estudiantes.crud")); // CRUD para el API
app.use("/api/estudiantes", require("./routes/estudiantes")); // CRUD para el HTML

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});