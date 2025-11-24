require('dotenv').config()
const express = require('express')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const mysql = require('mysql2/promise')

const app = express()
app.use(express.json())

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

const sessionStore = new MySQLStore({}, pool)

app.use(session({
  key: 'sid',
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  }
}))

const users = [
  { id: 1, username: 'usuario', password: '1234' }
]
app.use(express.static('public'))

app.get('/', (req, res) => {
    if (req.session.userId) {
        return res.redirect('/perfil-html');
    }
    res.sendFile(__dirname + '/public/index.html');
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  
  try {
    const [rows] = await pool.query(
        'SELECT id, username FROM users WHERE username = ? AND password = ?',
        [username, password]
    )

    const user = rows[0]

    if (!user) {
        return res.status(401).json({ mensaje: 'Usuario o contraseña incorrecta' })
    }

    req.session.userId = user.id
    req.session.username = user.username
    res.json({ mensaje: 'Has iniciado sesión correctamente', redirectTo: '/perfil-html' })
    
  } catch (error) {
      console.error('Error al intentar login:', error)
      res.status(500).json({ mensaje: 'Error interno del servidor' })
  }
})

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ mensaje: 'Error al cerrar sesión' })
    res.clearCookie('sid')
    res.json({ mensaje: 'Has cerrado sesión' })
  })
})

function requireAuth(req, res, next) {
  if (req.session && req.session.userId) return next()
  res.status(401).json({ mensaje: 'No autorizado' })
}

function requireAuth(req, res, next) {
  if (req.session && req.session.userId) return next()
  res.status(401).redirect('/');
}

app.get('/perfil', requireAuth, (req, res) => {
  res.json({ id: req.session.userId, usuario: req.session.username })
})

app.get('/perfil-html', requireAuth, (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Perfil</title>
            <style>
                body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; padding-top: 50px; }
                .card { background: #f0f0f0; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
                .logout-btn { background: #dc3545; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>Bienvenido, ${req.session.username}</h1>
                <p>Tu ID de usuario es: ${req.session.userId}</p>
                <p>¡Has iniciado sesión correctamente con la base de datos!</p>
                <button class="logout-btn" onclick="document.getElementById('logout-form').submit()">Cerrar Sesión</button>
            </div>
            <form id="logout-form" action="/logout" method="POST" style="display: none;"></form>
            <script>
                // Opcional: Implementación simple de logout con fetch para evitar redirección de POST
                document.getElementById('logout-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const response = await fetch('/logout', { method: 'POST' });
                    const data = await response.json();
                    alert(data.mensaje);
                    window.location.href = '/';
                });
            </script>
        </body>
        </html>
    `);
});
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Servidor en http://localhost:${port}`))