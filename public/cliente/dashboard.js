let cart = []
let allProducts = []

document.addEventListener('DOMContentLoaded', () => {
    loadProducts()
    
    document.getElementById('btn-checkout').addEventListener('click', processOrder)
})

async function loadProducts() {
    try {
        const response = await fetch('/api/productos')
        if (!response.ok) throw new Error('Error')
        
        allProducts = await response.json()
        renderCatalog(allProducts)
    } catch (error) {
        const grid = document.getElementById('products-grid')
        grid.innerHTML = '<p class="error-msg">No hay productos en existencias por el momento.</p>'
    }
}

function renderCatalog(products) {
    const grid = document.getElementById('products-grid')
    grid.innerHTML = ''

    if (products.length === 0) {
        grid.innerHTML = '<p class="no-stock">No hay productos en existencias.</p>'
        return
    }

    products.forEach(product => {
        const card = document.createElement('div')
        card.className = 'product-card'
        
        const price = parseFloat(product.precio).toFixed(2)

        card.innerHTML = `
            <div class="img-container">
                <img src="${product.imagen_url || '/imagenes/productos/imagen-planta.png'}" alt="${product.nombre}">
            </div>
            <div class="card-details">
                <h4>${product.nombre}</h4>
                <p class="desc">${product.descripcion}</p>
                <div class="buy-row">
                    <span class="price">$${price}</span>
                    <button onclick="addToCart(${product.id})" class="btn-add">Agregar ＋</button>
                </div>
            </div>
        `
        grid.appendChild(card)
    })
}

function addToCart(id) {
    const product = allProducts.find(p => p.id === id)
    const existingItem = cart.find(item => item.id === id)

    if (existingItem) {
        existingItem.cantidad++
    } else {
        cart.push({ ...product, cantidad: 1 })
    }
    updateCartUI()
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id)
    updateCartUI()
}

function updateCartUI() {
    const container = document.getElementById('cart-items')
    const totalEl = document.getElementById('cart-total')
    const btn = document.getElementById('btn-checkout')

    container.innerHTML = ''
    let total = 0

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-msg">Tu carrito está vacío</p>'
        btn.disabled = true
        totalEl.textContent = '$0.00'
        return
    }

    cart.forEach(item => {
        const itemTotal = item.precio * item.cantidad
        total += itemTotal
        
        const div = document.createElement('div')
        div.className = 'cart-item'
        div.innerHTML = `
            <div class="item-info">
                <strong>${item.nombre}</strong>
                <small>${item.cantidad} x $${item.precio}</small>
            </div>
            <div class="item-actions">
                <span>$${itemTotal.toFixed(2)}</span>
                <button onclick="removeFromCart(${item.id})" class="btn-remove">×</button>
            </div>
        `
        container.appendChild(div)
    })

    totalEl.textContent = `$${total.toFixed(2)}`
    btn.disabled = false
}

async function processOrder() {
    if (!confirm('¿Confirmar pedido?')) return

    const total = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
    const btn = document.getElementById('btn-checkout')
    btn.disabled = true
    btn.textContent = 'Procesando...'

    try {
        const response = await fetch('/api/pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cart, total: total })
        })

        const result = await response.json()

        if (response.ok) {
            alert(`¡Gracias por tu compra!\nID de Pedido: ${result.pedidoId}`)
            cart = []
            updateCartUI()
        } else {
            alert('Error: ' + result.error)
        }
    } catch (error) {
        alert('Error de conexión')
    } finally {
        btn.disabled = false
        btn.textContent = 'Realizar Pedido'
    }
}

window.addToCart = addToCart
window.removeFromCart = removeFromCart