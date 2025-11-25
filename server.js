require('dotenv').config()
const express = require('express')
const session = require('express-session')
const path = require('path')

const authRoutes = require('./routes/authRoutes')
const productosRoutes = require('./routes/productosRoutes')
const adminRoutes = require('./routes/adminRoutes') 

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}))

const checkAuth = (role) => (req, res, next) => {
    const publicFiles = ['index.html', 'login', 'registro.html', 'style.css', 'js', 'imagenes']
    const isPublic = publicFiles.some(file => req.path.includes(file))
    if (isPublic) return next()

    if (req.session && req.session.role === role) {
        return next()
    }
    res.redirect('/cliente/index.html')
}

app.use('/admin', checkAuth('admin'))
app.use('/cliente', checkAuth('cliente'))

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', authRoutes)
app.use('/api/productos', productosRoutes)
app.use('/api/admin', adminRoutes) 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(port, () => console.log(`Servidor en http://localhost:${port}`))