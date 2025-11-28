const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const productosController = require('../controllers/productosController')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/imagenes/productos')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

router.get('/', productosController.obtenerTodos)
router.get('/:id', productosController.obtenerUno)
router.post('/', upload.single('imagen'), productosController.crear)
router.put('/:id', upload.single('imagen'), productosController.editar)
router.delete('/:id', productosController.eliminar)

module.exports = router