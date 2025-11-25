const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')

const isAdmin = (req, res, next) => {
    if (req.session && req.session.role === 'admin') {
        return next()
    }
    res.status(403).json({ error: 'Acceso denegado' })
}

router.get('/stats', isAdmin, adminController.obtenerEstadisticas)

module.exports = router