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