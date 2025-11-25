const express = require('express')
const router = express.Router()
const productosController = require('../controllers/productosController')

router.get('/', productosController.obtenerTodos)
router.get('/:id', productosController.obtenerUno)
router.post('/', productosController.crear)
router.put('/:id', productosController.editar)
router.delete('/:id', productosController.eliminar)

module.exports = router