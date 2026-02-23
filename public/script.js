const form = document.getElementById("formEstudiante");
const tabla = document.getElementById("tablaEstudiantes");
const presentesSpan = document.getElementById("presentes");
const ausentesSpan = document.getElementById("ausentes");

let editId = null;

// ✅ Base URL relativa (funciona en Cloud Run y local)
// Si quieres correr local, también funciona si sirves frontend+api desde el mismo Express.
const API_BASE = "/api/estudiante";

// Helper para fetch con manejo básico de errores
async function apiFetch(url, options = {}) {
  const res = await fetch(url, options);

  // Si el backend devuelve HTML de error o JSON distinto, igual intentamos leer algo útil
  const contentType = res.headers.get("content-type") || "";
  let payload = null;

  try {
    if (contentType.includes("application/json")) {
      payload = await res.json();
    } else {
      payload = await res.text();
    }
  } catch (e) {
    payload = null;
  }

  if (!res.ok) {
    console.error("API Error:", res.status, url, payload);
    throw new Error(`API error ${res.status} en ${url}`);
  }

  return payload;
}

// ==============================
// SUBMIT (CREAR O EDITAR)
// ==============================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    nombre: document.getElementById("nombre").value.trim(),
    apellido: document.getElementById("apellido").value.trim(),
    edad: document.getElementById("edad").value,
    grado: document.getElementById("grado").value,
    correo: document.getElementById("correo").value.trim()
  };

  try {
    if (editId) {
      await apiFetch(`${API_BASE}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      editId = null;
      form.querySelector("button").textContent = "Registrar";
    } else {
      await apiFetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    }

    form.reset();
    await cargarEstudiantes();
  } catch (err) {
    alert("No se pudo guardar el estudiante. Revisa la consola (F12) y los logs en Cloud Run.");
  }
});

// ==============================
// CARGAR ESTUDIANTES
// ==============================
async function cargarEstudiantes() {
  try {
    const estudiantes = await apiFetch(API_BASE); // ✅ GET /api/estudiante

    // Si por alguna razón el backend no devuelve array, evita el crash
    if (!Array.isArray(estudiantes)) {
      console.error("Respuesta no es un array:", estudiantes);
      tabla.innerHTML = "";
      actualizarResumen([]);
      return;
    }

    tabla.innerHTML = "";

    estudiantes.forEach((est) => {
      tabla.innerHTML += `
        <tr>
          <td>${est.nombre ?? ""} ${est.apellido ?? ""}</td>
          <td>${est.edad ?? ""}</td>
          <td>${est.grado ?? ""}</td>
          <td>${est.correo ?? ""}</td>
          <td>
            <input type="checkbox" ${est.asistencia ? "checked" : ""}
              onchange="actualizarAsistencia(${est.id}, this.checked)">
          </td>
          <td>
            <button onclick="editar(${est.id})">Editar</button>
            <button onclick="eliminarEstudiante(${est.id})">Eliminar</button>
          </td>
        </tr>
      `;
    });

    actualizarResumen(estudiantes);
  } catch (err) {
    console.error(err);
    // Para no dejar la tabla “rota”
    tabla.innerHTML = "";
    actualizarResumen([]);
  }
}

// ==============================
// ACTUALIZAR ASISTENCIA
// ==============================
async function actualizarAsistencia(id, valor) {
  try {
    await apiFetch(`${API_BASE}/${id}/asistencia`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ asistencia: valor })
    });
    await cargarEstudiantes();
  } catch (err) {
    alert("No se pudo actualizar asistencia. Revisa consola/logs.");
  }
}

// ==============================
// EDITAR
// ==============================
async function editar(id) {
  try {
    // Ideal: endpoint por ID. Si tu backend no lo tiene, hacemos fallback.
    let est = null;

    try {
      est = await apiFetch(`${API_BASE}/${id}`); // ✅ si existe GET /api/estudiante/:id
    } catch {
      const estudiantes = await apiFetch(API_BASE); // fallback
      if (Array.isArray(estudiantes)) {
        est = estudiantes.find((e) => e.id === id);
      }
    }

    if (!est) {
      alert("No se encontró el estudiante para editar.");
      return;
    }

    document.getElementById("nombre").value = est.nombre ?? "";
    document.getElementById("apellido").value = est.apellido ?? "";
    document.getElementById("edad").value = est.edad ?? "";
    document.getElementById("grado").value = est.grado ?? "";
    document.getElementById("correo").value = est.correo ?? "";

    editId = id;
    form.querySelector("button").textContent = "Actualizar";
  } catch (err) {
    alert("No se pudo cargar el estudiante para editar. Revisa consola/logs.");
  }
}

// ==============================
// ELIMINAR
// ==============================
async function eliminarEstudiante(id) {
  try {
    await apiFetch(`${API_BASE}/${id}`, {
      method: "DELETE"
    });
    await cargarEstudiantes();
  } catch (err) {
    alert("No se pudo eliminar. Revisa consola/logs.");
  }
}

// ==============================
// MARCAR / DESMARCAR TODOS
// ==============================
async function marcarTodos(valor) {
  try {
    await apiFetch(`${API_BASE}/asistencia/todos`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ asistencia: valor })
    });
    await cargarEstudiantes();
  } catch (err) {
    alert("No se pudo marcar/desmarcar todos. Revisa consola/logs.");
  }
}

// ==============================
// DESCARGAR EXCEL
// ==============================
async function descargarExcel() {
  try {
    const estudiantes = await apiFetch(API_BASE);

    if (!Array.isArray(estudiantes)) {
      alert("No hay datos válidos para exportar.");
      return;
    }

    const datos = estudiantes.map((est) => ({
      Nombre: `${est.nombre ?? ""} ${est.apellido ?? ""}`.trim(),
      Edad: est.edad ?? "",
      Grado: est.grado ?? "",
      Correo: est.correo ?? "",
      Asistencia: est.asistencia ? "Presente" : "Ausente"
    }));

    const worksheet = XLSX.utils.json_to_sheet(datos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Asistencia");

    XLSX.writeFile(workbook, "lista_asistencia.xlsx");
  } catch (err) {
    alert("No se pudo descargar el Excel. Revisa consola/logs.");
  }
}

// ==============================
// ACTUALIZAR RESUMEN
// ==============================
function actualizarResumen(estudiantes) {
  const lista = Array.isArray(estudiantes) ? estudiantes : [];
  const presentes = lista.filter((e) => e.asistencia).length;
  const ausentes = lista.length - presentes;

  presentesSpan.textContent = presentes;
  ausentesSpan.textContent = ausentes;

  const total = lista.length || 1;

  const bgPresentes = document.querySelector(".bg-presentes");
  const bgAusentes = document.querySelector(".bg-ausentes");

  if (bgPresentes) bgPresentes.style.width = `${(presentes / total) * 100}%`;
  if (bgAusentes) bgAusentes.style.width = `${(ausentes / total) * 100}%`;
}

// ==============================
// INICIAR
// ==============================
cargarEstudiantes();

// Exponer funciones al scope global (porque las llamas desde onclick="")
window.actualizarAsistencia = actualizarAsistencia;
window.editar = editar;
window.eliminarEstudiante = eliminarEstudiante;
window.marcarTodos = marcarTodos;
window.descargarExcel = descargarExcel;
