document.addEventListener('DOMContentLoaded', () => {
    const headerContainer = document.getElementById('dynamic-header')
    if (headerContainer) {
        verificarSesion()
    }
})

async function verificarSesion() {
    try {
        const response = await fetch('/api/auth/verificar')
        const session = await response.json()

        const path = window.location.pathname
        
        const isClientProtectedArea = path.includes('/cliente/') && 
                                      !path.includes('index.html') && 
                                      !path.includes('registro.html') &&
                                      !path.includes('recuperar.html')

        if (isClientProtectedArea) {
            if (!session.ok || session.rol !== 'cliente') {
                window.location.href = '/cliente/index.html'
                return 
            }
        }

        renderHeader(session)

    } catch (error) {
        console.error('Error de sesión:', error)
        if (window.location.pathname.includes('/cliente/') && !window.location.pathname.includes('index.html')) {
            window.location.href = '/cliente/index.html'
        }
    }
}

function renderHeader(session) {
    const headerContainer = document.getElementById('dynamic-header')
    let navHTML = ''
    
    const logoutStyle = 'background-color: #c0392b; color: white; padding: 4px 10px; border-radius: 4px; text-decoration: none; font-size: 0.9em; margin-left: 10px;'

    if (session.ok && session.rol === 'admin') {
        navHTML = `
            <div class="top-bar">
                <div class="container-top">
                    <span>Panel Admin - ${session.usuario}</span>
                    <a href="/logout" style="${logoutStyle}">Cerrar Sesión</a>
                </div>
            </div>
            <header style="background-color: #2D5016; padding: 15px;">
                <h1 style="color: white; margin: 0; font-size: 1.5rem;">Technoseed Admin</h1>
            </header>
            <nav>
                <ul>
                    <li><a href="/admin/dashboard.html">Resumen</a></li>
                    <li><a href="/admin/productos/index.html">Inventario</a></li>
                    <li><a href="#">Ventas</a></li>
                </ul>
            </nav>
        `
    } else if (session.ok && session.rol === 'cliente') {
        navHTML = `
            <div class="top-bar">
                <div class="container-top">
                    <span>Hola, ${session.usuario}</span>
                    <a href="/logout" style="${logoutStyle}">Salir</a>
                </div>
            </div>
            <header>
                <h1>Technoseed</h1>
                <p>Tu espacio verde</p>
            </header>
            <nav>
                <ul>
                    <li><a href="/cliente/dashboard.html">Catálogo</a></li>
                    <li><a href="/cliente/pedidos.html">Mis Compras</a></li>
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
                <p>Plantas y Suculentas</p>
            </header>
            <nav>
                <ul>
                    <li><a href="/">Inicio</a></li>
                    <li><a href="/#nosotros">Nosotros</a></li>
                    <li><a href="/#menu">Catálogo</a></li>
                    <li><a href="/#contacto">Contacto</a></li>
                </ul>
            </nav>
        `
    }

    headerContainer.innerHTML = navHTML
}