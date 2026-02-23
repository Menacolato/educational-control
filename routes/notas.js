const express = require('express');
const router = express.Router();
const db = require('../db');

// LISTAR NOTAS
router.get('/', (req, res) => {
  db.query('SELECT * FROM notas', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// CREAR NOTA
router.post('/', (req, res) => {
  const { estudiante, materia, nota1, nota2, nota3 } = req.body;

  const promedio = (nota1 + nota2 + nota3) / 3;

  const sql = `
    INSERT INTO notas (estudiante, materia, nota1, nota2, nota3, promedio)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [estudiante, materia, nota1, nota2, nota3, promedio], (err) => {
    if (err) throw err;
    res.send('Nota registrada');
  });
});

// ELIMINAR
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM notas WHERE id=?', [req.params.id], (err) => {
    if (err) throw err;
    res.send('Nota eliminada');
  });
});

module.exports = router;