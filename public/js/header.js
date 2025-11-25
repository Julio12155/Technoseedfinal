document.addEventListener('DOMContentLoaded', () => {
    const headerContainer = document.getElementById('dynamic-header')
    if (!headerContainer) return

    verificarYRenderizar()
})

async function verificarYRenderizar() {
    try {
        const response = await fetch('/api/auth/verificar')
        
        if (!response.ok) {
            throw new Error('Sesión no válida')
        }

        const data = await response.json()

        if (data.ok) {
            renderNav(data.rol, data.usuario)
        } else {
            manejarSinSesion()
        }

    } catch (error) {
        console.error('Error de sesión:', error)
        manejarSinSesion()
    }
}

function manejarSinSesion() {
    const path = window.location.pathname
    if (path.includes('/admin') || (path.includes('/cliente') && !path.includes('index.html') && !path.includes('registro.html'))) {
        window.location.href = '/cliente/index.html'
    }
    renderNav('visitante', null)
}

function renderNav(rol, usuario) {
    const headerContainer = document.getElementById('dynamic-header')
    let navHTML = ''

    const logoutBtnStyle = `
        background-color: #c0392b; 
        color: white; 
        padding: 5px 10px; 
        text-decoration: none; 
        border-radius: 4px; 
        font-weight: bold; 
        font-size: 0.9rem;
        margin-left: 15px;
    `

    if (rol === 'admin') {
        navHTML = `
            <div class="top-bar">
                <div class="container-top">
                    <span>Panel de Administración - ${usuario}</span>
                    <a href="/logout" style="${logoutBtnStyle}">Cerrar Sesión</a>
                </div>
            </div>
            <header style="background-color: #1a330a; padding: 20px;">
                <h1 style="color:white; margin:0;">Technoseed Admin</h1>
            </header>
            <nav>
                <ul>
                    <li><a href="/admin/dashboard.html">Inicio</a></li>
                    <li><a href="/admin/productos/index.html">Productos</a></li>
                    <li><a href="#">Ventas</a></li>
                </ul>
            </nav>
        `
    } else if (rol === 'cliente') {
        navHTML = `
            <div class="top-bar">
                <div class="container-top">
                    <span>Hola, ${usuario}</span>
                    <a href="/logout" style="${logoutBtnStyle}">Salir</a>
                </div>
            </div>
            <header>
                <h1>Technoseed</h1>
            </header>
            <nav>
                <ul>
                    <li><a href="/cliente/dashboard.html">Catálogo</a></li>
                    <li><a href="#">Mis Compras</a></li>
                </ul>
            </nav>
        `
    } else {
        navHTML = `
            <div class="top-bar">
                <div class="container-top">
                    <span>Bienvenido a Technoseed</span>
                    <a href="/cliente/index.html" class="btn-login">Iniciar Sesión</a>
                </div>
            </div>
            <header>
                <h1>Technoseed</h1>
            </header>
            <nav>
                <ul>
                    <li><a href="/">Inicio</a></li>
                    <li><a href="/#nosotros">Nosotros</a></li>
                    <li><a href="/#menu">Catálogo</a></li>
                </ul>
            </nav>
        `
    }

    headerContainer.innerHTML = navHTML
}