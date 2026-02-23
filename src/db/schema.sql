-- Crear base si no existe
CREATE DATABASE IF NOT EXISTS educational_control;
USE educational_control;

-- Tabla correcta (nombre en plural como usa tu API)
CREATE TABLE IF NOT EXISTS estudiantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    edad INT NOT NULL CHECK (edad > 0),
    grado VARCHAR(50) NOT NULL,
    correo VARCHAR(150) UNIQUE,
    asistencia BOOLEAN DEFAULT FALSE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

USE educational_control;
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    correo VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    rol ENUM('estudiante','docente','admin') NOT NULL,

    -- Datos estudiante
    grado INT,
    seccion VARCHAR(10),
    turno VARCHAR(20),

    -- Datos docente
    materia_principal VARCHAR(100),
    telefono VARCHAR(20)
);
CREATE TABLE materias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100)
);
CREATE TABLE docente_materias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    docente_id INT,
    materia_id INT,
    grado INT,
    seccion VARCHAR(10),
    FOREIGN KEY (docente_id) REFERENCES usuarios(id),
    FOREIGN KEY (materia_id) REFERENCES materias(id)
);
CREATE TABLE tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    docente_materia_id INT,
    titulo VARCHAR(150),
    descripcion TEXT,
    fecha_entrega DATE,
    valor DECIMAL(5,2),
    FOREIGN KEY (docente_materia_id) REFERENCES docente_materias(id)
);
CREATE TABLE notas_tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tarea_id INT,
    estudiante_id INT,
    nota DECIMAL(5,2),
    FOREIGN KEY (tarea_id) REFERENCES tareas(id),
    FOREIGN KEY (estudiante_id) REFERENCES usuarios(id)
);
CREATE TABLE asistencia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    docente_materia_id INT,
    estudiante_id INT,
    fecha DATE,
    presente BOOLEAN,
    FOREIGN KEY (docente_materia_id) REFERENCES docente_materias(id),
    FOREIGN KEY (estudiante_id) REFERENCES usuarios(id)
);