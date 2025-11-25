const db = require('../config/db')

exports.obtenerEstadisticas = async (req, res) => {
    try {
        const [productos] = await db.execute('SELECT COUNT(*) as total FROM productos')
        const [clientes] = await db.execute('SELECT COUNT(*) as total FROM clientes')
        
        const ventas = 0 
        const pedidos = 0

        res.json({
            success: true,
            data: {
                productos: productos[0].total,
                clientes: clientes[0].total,
                ventas: ventas,
                pedidos: pedidos
            }
        })
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error)
        res.status(500).json({ success: false, message: 'Error del servidor' })
    }
}