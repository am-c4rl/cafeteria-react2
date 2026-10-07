require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000; // Puerto dinámico para Render[cite: 1]

app.use(express.json());
app.use(cors()); // Habilitar CORS para permitir llamadas externas[cite: 1]

// Pool de conexión con soporte SSL para Aiven y variables de entorno[cite: 1]
const conexion = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: { rejectUnauthorized: false }, // Permite la conexión cifrada requerida por Aiven[cite: 1]
    waitForConnections: true,
    connectionLimit: 10
});

// Probar la conexión del pool
conexion.getConnection((err, connection) => {
    if (err) {
        console.error('Error de conexión a la base de datos: ', err);
        return;
    }
    console.log('Conectado a MySQL en Aiven con éxito');
    connection.release();
});

// CRUD Estudiantes[cite: 1]
app.get('/estudiantes', (req, res) => {
    conexion.query('SELECT * FROM estudiantes', (err, resultados) => {
        if (err) return res.status(500).send(err);
        res.json(resultados);
    });
});

app.post('/estudiantes', (req, res) => {
    const { nombre, grupo } = req.body;
    conexion.query(
        'INSERT INTO estudiantes (nombre, grupo) VALUES (?, ?)',
        [nombre, grupo],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send(`Estudiante agregado: ${nombre}`);
        }
    );
});

app.put('/estudiantes/:id', (req, res) => {
    const id = req.params.id;
    const { nombre, grupo } = req.body;
    conexion.query(
        'UPDATE estudiantes SET nombre=?, grupo=? WHERE id=?',
        [nombre, grupo, id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send(`Estudiante con ID ${id} actualizado`);
        }
    );
});

app.delete('/estudiantes/:id', (req, res) => {
    const id = req.params.id;
    conexion.query(
        'DELETE FROM estudiantes WHERE id=?',
        [id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send(`Estudiante con ID ${id} eliminado`);
        }
    );
});

// CRUD Productos[cite: 1]
app.get('/productos', (req, res) => {
    conexion.query('SELECT * FROM productos', (err, resultados) => {
        if (err) return res.status(500).send(err);
        res.json(resultados);
    });
});

app.post('/productos', (req, res) => {
    const { nombre, precio } = req.body;
    conexion.query(
        'INSERT INTO productos (nombre, precio) VALUES (?, ?)',
        [nombre, precio],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send(`Producto agregado: ${nombre}`);
        }
    );
});

app.put('/productos/:id', (req, res) => {
    const id = req.params.id;
    const { nombre, precio } = req.body;
    conexion.query(
        'UPDATE productos SET nombre=?, precio=? WHERE id=?',
        [nombre, precio, id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send(`Producto con ID ${id} actualizado`);
        }
    );
});

app.delete('/productos/:id', (req, res) => {
    const id = req.params.id;
    conexion.query(
        'DELETE FROM productos WHERE id=?',
        [id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send(`Producto con ID ${id} eliminado`);
        }
    );
});

// CRUD Ventas con JOIN[cite: 1]
app.get('/ventas', (req, res) => {
    const sql = `
        SELECT v.id, e.nombre AS estudiante, p.nombre AS producto,
        v.cantidad, v.fecha, p.precio,
        (v.cantidad * p.precio) AS total,
        v.estudiante_id, v.producto_id
        FROM ventas v
        INNER JOIN estudiantes e ON v.estudiante_id = e.id
        INNER JOIN productos p ON v.producto_id = p.id
    `;
    conexion.query(sql, (err, resultados) => {
        if (err) return res.status(500).send(err);
        res.json(resultados);
    });
});

// POST Ventas[cite: 1]
app.post('/ventas', (req, res) => {
    const { estudiante_id, producto_id, cantidad, fecha } = req.body;
    conexion.query(
        'INSERT INTO ventas (estudiante_id, producto_id, cantidad, fecha) VALUES (?, ?, ?, ?)',
        [estudiante_id, producto_id, cantidad, fecha],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send({ message: 'Venta registrada correctamente' });
        }
    );
});

// PUT Ventas[cite: 1]
app.put('/ventas/:id', (req, res) => {
    const id = req.params.id;
    const { estudiante_id, producto_id, cantidad, fecha } = req.body;
    conexion.query(
        'UPDATE ventas SET estudiante_id=?, producto_id=?, cantidad=?, fecha=? WHERE id=?',
        [estudiante_id, producto_id, cantidad, fecha, id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send({ message: `Venta con ID ${id} actualizada` });
        }
    );
});

// DELETE Ventas[cite: 1]
app.delete('/ventas/:id', (req, res) => {
    const id = req.params.id;
    conexion.query(
        'DELETE FROM ventas WHERE id=?',
        [id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send({ message: `Venta con ID ${id} eliminada` });
        }
    );
});

// Iniciar servidor[cite: 1]
app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});