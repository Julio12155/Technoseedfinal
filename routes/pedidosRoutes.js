const express = require('express')
const router = express.Router()
const pedidosController = require('../controllers/pedidosController')

const isClient = (req, res, next) => {
    if (req.session.role === 'cliente') return next()
    res.status(403).json({ error: 'Acceso denegado' })
}

router.post('/', isClient, pedidosController.crearPedido)
router.get('/', isClient, pedidosController.obtenerMisPedidos)

module.exports = router