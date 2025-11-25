const bcrypt = require('bcryptjs')
const db = require('../config/db')

exports.registerCliente = async (req, res) => {
    const { nombre, email, password } = req.body
    
    try {
        const [rows] = await db.execute('SELECT email FROM clientes WHERE email = ?', [email])
        if (rows.length > 0) {
            return res.redirect('/cliente/registro.html?error=existe')
        }

        const hash = await bcrypt.hash(password, 12)
        
        await db.execute('INSERT INTO clientes (nombre, email, password_hash) VALUES (?, ?, ?)', [
            nombre, 
            email, 
            hash
        ])

        res.redirect('/cliente/index.html?registro=exitoso')
    } catch (error) {
        console.log(error)
        res.redirect('/cliente/registro.html?error=servidor')
    }
}

exports.loginCliente = async (req, res) => {
    const { email, password } = req.body

    try {
        if (req.session.role === 'admin') {
            req.session.destroy()
        }

        const [rows] = await db.execute('SELECT * FROM clientes WHERE email = ?', [email])
        
        if (rows.length === 0) {
            return res.redirect('/cliente/index.html?error=credenciales')
        }

        const user = rows[0]
        const match = await bcrypt.compare(password, user.password_hash)

        if (!match) {
            return res.redirect('/cliente/index.html?error=credenciales')
        }

        req.session.regenerate(() => {
            req.session.userId = user.id
            req.session.role = 'cliente'
            req.session.nombre = user.nombre
            res.redirect('/cliente/dashboard.html')
        })

    } catch (error) {
        console.log(error)
        res.redirect('/cliente/index.html?error=servidor')
    }
}

exports.loginAdmin = async (req, res) => {
    const { username, password } = req.body

    try {
        if (req.session.role === 'cliente') {
            req.session.destroy()
        }

        const [rows] = await db.execute('SELECT * FROM admins WHERE username = ?', [username])

        if (rows.length === 0) {
            return res.redirect('/admin/index.html?error=credenciales')
        }

        const admin = rows[0]
        const match = await bcrypt.compare(password, admin.password_hash)

        if (!match) {
            return res.redirect('/admin/index.html?error=credenciales')
        }

        req.session.regenerate(() => {
            req.session.userId = admin.id
            req.session.role = 'admin'
            req.session.username = admin.username
            res.redirect('/admin/dashboard.html')
        })

    } catch (error) {
        console.log(error)
        res.redirect('/admin/index.html?error=servidor')
    }
}

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}
exports.getSession = (req, res) => {
    if (req.session.userId) {
        res.json({ 
            isAuthenticated: true, 
            role: req.session.role, 
            nombre: req.session.nombre || req.session.username 
        })
    } else {
        res.json({ isAuthenticated: false })
    }
}
exports.verificarSesion = (req, res) => {
    if (req.session && req.session.userId) {
        res.json({
            ok: true,
            rol: req.session.role,
            usuario: req.session.nombre || req.session.username
        })
    } else {
        res.status(401).json({ ok: false, message: 'No hay sesión activa' })
    }
}