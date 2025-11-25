const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.post('/cliente/registro', authController.registerCliente)
router.post('/cliente/login', authController.loginCliente)
router.post('/admin/login', authController.loginAdmin)
router.get('/logout', authController.logout)

module.exports = router