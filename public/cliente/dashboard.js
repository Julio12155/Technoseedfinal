document.addEventListener('DOMContentLoaded', () => {
    fetchProductos()
})

async function fetchProductos() {
    try {
        const response = await fetch('/api/productos')
        if (!response.ok) {
            throw new Error('Error al cargar productos')
        }
        const productos = await response.json()
        renderProductos(productos)
    } catch (error) {
        console.error(error)
        alert('No se pudo conectar con el servidor')
    }
}

function renderProductos(productos) {
    const container = document.getElementById('product-list')
    container.innerHTML = ''

    productos.forEach(producto => {
        const card = document.createElement('div')
        card.className = 'menu-section'
        
        const nombre = document.createElement('h3')
        nombre.textContent = producto.nombre

        const precio = document.createElement('p')
        precio.innerHTML = `<strong>Precio:</strong> $${producto.precio}`

        const stock = document.createElement('p')
        stock.innerHTML = `<strong>Disponibles:</strong> ${producto.stock}`

        const desc = document.createElement('p')
        desc.textContent = producto.descripcion
        desc.style.fontSize = '0.9em'
        desc.style.marginTop = '10px'

        const btn = document.createElement('button')
        btn.textContent = 'Añadir al Carrito'
        btn.style.width = '100%'
        btn.style.padding = '10px'
        btn.style.marginTop = '15px'
        btn.style.backgroundColor = '#4A7C2C'
        btn.style.color = 'white'
        btn.style.border = 'none'
        btn.style.cursor = 'pointer'
        
        btn.addEventListener('mouseover', () => {
            btn.style.backgroundColor = '#2D5016'
        })
        btn.addEventListener('mouseout', () => {
            btn.style.backgroundColor = '#4A7C2C'
        })

        card.appendChild(nombre)
        card.appendChild(desc)
        card.appendChild(precio)
        card.appendChild(stock)
        card.appendChild(btn)

        container.appendChild(card)
    })
}