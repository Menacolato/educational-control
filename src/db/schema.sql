-- 1) Crea BD si no existe
CREATE DATABASE IF NOT EXISTS educational_control;
USE educational_control;

-- 2) Tabla ejemplo base: students (puedes cambiar nombres luego)
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);