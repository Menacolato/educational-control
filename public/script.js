const form = document.getElementById("formEstudiante");
const tabla = document.getElementById("tablaEstudiantes");
const presentesSpan = document.getElementById("presentes");
const ausentesSpan = document.getElementById("ausentes");

// Variable para almacenar el ID cuando estamos editando
let editId = null;

// Evento submit (Agregar o Editar)
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        nombre: nombre.value,
        apellido: apellido.value,
        edad: edad.value,
        grado: grado.value,
        correo: correo.value
    };

    if(editId) {
        // EDITAR estudiante completo
        await fetch(`http://localhost:3000/api/estudiantes/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        editId = null;
        form.querySelector("button").textContent = "Registrar";
    } else {
        // AGREGAR nuevo estudiante
        await fetch("http://localhost:3000/api/estudiantes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
    }

    form.reset();
    cargarEstudiantes();
});

// Cargar estudiantes en la tabla
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

// Actualiza asistencia
async function actualizarAsistencia(id, valor) {
    await fetch(`http://localhost:3000/api/estudiantes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asistencia: valor })
    });
    cargarEstudiantes();
}

// Eliminar estudiante
async function eliminar(id) {
    await fetch(`http://localhost:3000/api/estudiantes/${id}`, {
        method: "DELETE"
    });
    cargarEstudiantes();
}

// Función para editar estudiante
async function editar(id) {
    const res = await fetch(`http://localhost:3000/api/estudiantes`);
    const estudiantes = await res.json();
    const est = estudiantes.find(e => e.id === id);

    nombre.value = est.nombre;
    apellido.value = est.apellido;
    edad.value = est.edad;
    grado.value = est.grado;
    correo.value = est.correo;

    editId = id;
    form.querySelector("button").textContent = "Actualizar";
}

// Actualizar resumen y barras
function actualizarResumen(estudiantes) {
    const presentes = estudiantes.filter(e => e.asistencia).length;
    const ausentes = estudiantes.length - presentes;

    presentesSpan.textContent = presentes;
    ausentesSpan.textContent = ausentes;

    const total = estudiantes.length || 1;
    document.querySelector(".bg-presentes").style.width = `${(presentes/total)*100}%`;
    document.querySelector(".bg-ausentes").style.width = `${(ausentes/total)*100}%`;
}

// Inicializar tabla al cargar página
cargarEstudiantes();