const db = require('../config/db')

exports.obtenerEstadisticas = async (req, res) => {
    try {
        const [productos] = await db.execute('SELECT COUNT(*) as total FROM productos')
        const [clientes] = await db.execute('SELECT COUNT(*) as total FROM clientes')
        
        const [pedidosCount] = await db.execute('SELECT COUNT(*) as total FROM pedidos')
        const [ventasTotal] = await db.execute('SELECT SUM(total) as total FROM pedidos')

        res.json({
            success: true,
            data: {
                productos: productos[0].total,
                clientes: clientes[0].total,
                ventas: ventasTotal[0].total || 0, 
                pedidos: pedidosCount[0].total     
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Error del servidor' })
    }
}