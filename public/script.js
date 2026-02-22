const form = document.getElementById("formEstudiante");
const tabla = document.getElementById("tablaEstudiantes");
const presentesSpan = document.getElementById("presentes");
const ausentesSpan = document.getElementById("ausentes");

let editId = null;

// ==============================
// SUBMIT (CREAR O EDITAR)
// ==============================
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        edad: document.getElementById("edad").value,
        grado: document.getElementById("grado").value,
        correo: document.getElementById("correo").value
    };

    if (editId) {
        await fetch(`http://localhost:3000/api/estudiantes/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        editId = null;
        form.querySelector("button").textContent = "Registrar";
    } else {
        await fetch("http://localhost:3000/api/estudiantes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
    }

    form.reset();
    cargarEstudiantes();
});

// ==============================
// CARGAR ESTUDIANTES
// ==============================
async function cargarEstudiantes() {
    const res = await fetch("http://localhost:3000/api/estudiantes");
    const estudiantes = await res.json();

    tabla.innerHTML = "";

    estudiantes.forEach(est => {
        tabla.innerHTML += `
        <tr>
            <td>${est.nombre} ${est.apellido}</td>
            <td>${est.edad}</td>
            <td>${est.grado}</td>
            <td>${est.correo || ""}</td>
            <td>
                <input type="checkbox" ${est.asistencia ? "checked" : ""}
                onchange="actualizarAsistencia(${est.id}, this.checked)">
            </td>
            <td>
                <button onclick="editar(${est.id})">Editar</button>
                <button onclick="eliminar(${est.id})">Eliminar</button>
            </td>
        </tr>
        `;
    });

    actualizarResumen(estudiantes);
}

// ==============================
// ACTUALIZAR ASISTENCIA
// ==============================
async function actualizarAsistencia(id, valor) {
    await fetch(`http://localhost:3000/api/estudiantes/${id}/asistencia`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asistencia: valor })
    });
    cargarEstudiantes();
}

// ==============================
// EDITAR
// ==============================
async function editar(id) {
    const res = await fetch("http://localhost:3000/api/estudiantes");
    const estudiantes = await res.json();
    const est = estudiantes.find(e => e.id === id);

    document.getElementById("nombre").value = est.nombre;
    document.getElementById("apellido").value = est.apellido;
    document.getElementById("edad").value = est.edad;
    document.getElementById("grado").value = est.grado;
    document.getElementById("correo").value = est.correo;

    editId = id;
    form.querySelector("button").textContent = "Actualizar";
}

// ==============================
// ELIMINAR
// ==============================
async function eliminar(id) {
    await fetch(`http://localhost:3000/api/estudiantes/${id}`, {
        method: "DELETE"
    });
    cargarEstudiantes();
}

// ==============================
// MARCAR / DESMARCAR TODOS
// ==============================
async function marcarTodos(valor) {
    await fetch("http://localhost:3000/api/estudiantes/asistencia/todos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asistencia: valor })
    });
    cargarEstudiantes();
}

// ==============================
// DESCARGAR EXCEL
// ==============================
async function descargarExcel() {
    const res = await fetch("http://localhost:3000/api/estudiantes");
    const estudiantes = await res.json();

    const datos = estudiantes.map(est => ({
        Nombre: est.nombre + " " + est.apellido,
        Edad: est.edad,
        Grado: est.grado,
        Correo: est.correo || "",
        Asistencia: est.asistencia ? "Presente" : "Ausente"
    }));

    const worksheet = XLSX.utils.json_to_sheet(datos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Asistencia");

    XLSX.writeFile(workbook, "lista_asistencia.xlsx");
}

// ==============================
// ACTUALIZAR RESUMEN
// ==============================
function actualizarResumen(estudiantes) {
    const presentes = estudiantes.filter(e => e.asistencia).length;
    const ausentes = estudiantes.length - presentes;

    presentesSpan.textContent = presentes;
    ausentesSpan.textContent = ausentes;

    const total = estudiantes.length || 1;

    document.querySelector(".bg-presentes").style.width =
        `${(presentes / total) * 100}%`;

    document.querySelector(".bg-ausentes").style.width =
        `${(ausentes / total) * 100}%`;
}

// ==============================
// INICIAR
// ==============================
cargarEstudiantes();