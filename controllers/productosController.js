const db = require('../config/db')

exports.obtenerTodos = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM productos')
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' })
    }
}

exports.obtenerUno = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM productos WHERE id = ?', [req.params.id])
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }
        res.json(rows[0])
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' })
    }
}

exports.crear = async (req, res) => {
    const { nombre, precio, stock, descripcion } = req.body
    
    if (!nombre || !precio || !stock) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' })
    }

    try {
        const imagen_url = '/imagenes/productos/imagen-planta.png'
        await db.execute(
            'INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url) VALUES (?, ?, ?, ?, ?)',
            [nombre, descripcion, precio, stock, imagen_url]
        )
        res.status(201).json({ message: 'Producto creado' })
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' })
    }
}

exports.editar = async (req, res) => {
    const { id } = req.params
    const { nombre, precio, stock, descripcion } = req.body

    if (!nombre || !precio || !stock) {
        return res.status(400).json({ error: 'Datos inválidos' })
    }

    try {
        await db.execute(
            'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id = ?',
            [nombre, descripcion, precio, stock, id]
        )
        res.json({ message: 'Producto actualizado' })
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar' })
    }
}

exports.eliminar = async (req, res) => {
    try {
        await db.execute('DELETE FROM productos WHERE id = ?', [req.params.id])
        res.json({ message: 'Producto eliminado' })
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar' })
    }
}