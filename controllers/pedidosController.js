const db = require('../config/db')

exports.crearPedido = async (req, res) => {
    const { items, total } = req.body
    const cliente_id = req.session.userId

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'El carrito está vacío' })
    }

    const connection = await db.getConnection()

    try {
        await connection.beginTransaction()

        const [pedidoResult] = await connection.execute(
            'INSERT INTO pedidos (cliente_id, total) VALUES (?, ?)',
            [cliente_id, total]
        )

        const pedido_id = pedidoResult.insertId

        for (const item of items) {
            await connection.execute(
                'INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio) VALUES (?, ?, ?, ?)',
                [pedido_id, item.id, item.cantidad, item.precio]
            )
        }

        await connection.commit()
        res.status(201).json({ message: 'Pedido realizado con éxito', pedidoId: pedido_id })

    } catch (error) {
        await connection.rollback()
        console.error(error)
        res.status(500).json({ error: 'Error al procesar el pedido' })
    } finally {
        connection.release()
    }
}

exports.obtenerMisPedidos = async (req, res) => {
    try {
        const sql = `
            SELECT 
                p.id AS pedido_id, 
                p.total, 
                p.created_at AS fecha, 
                p.estado,
                dp.cantidad, 
                dp.precio AS precio_unitario,
                pr.nombre AS producto_nombre
            FROM pedidos p
            JOIN detalle_pedidos dp ON p.id = dp.pedido_id
            JOIN productos pr ON dp.producto_id = pr.id
            WHERE p.cliente_id = ?
            ORDER BY p.created_at DESC
        `
        
        const [rows] = await db.execute(sql, [req.session.userId])
        
        const pedidosMap = new Map()
        
        rows.forEach(row => {
            if (!pedidosMap.has(row.pedido_id)) {
                pedidosMap.set(row.pedido_id, {
                    id: row.pedido_id,
                    total: row.total,
                    fecha: row.fecha, 
                    estado: row.estado,
                    items: [] 
                })
            }
            pedidosMap.get(row.pedido_id).items.push({
                nombre: row.producto_nombre,
                cantidad: row.cantidad,
                precio: row.precio_unitario,
                subtotal: row.cantidad * row.precio_unitario
            })
        })

        res.json(Array.from(pedidosMap.values()))
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener el historial' })
    }
}