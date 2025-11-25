document.addEventListener('DOMContentLoaded', () => {
    cargarPedidos()
})

async function cargarPedidos() {
    const container = document.getElementById('orders-list')
    
    try {
        const response = await fetch('/api/pedidos')
        if (!response.ok) throw new Error('Error de conexión')
        
        const pedidos = await response.json()

        container.innerHTML = ''

        if (pedidos.length === 0) {
            container.innerHTML = `
                <div class="no-orders">
                    <p>Aún no has realizado ninguna compra.</p>
                    <a href="dashboard.html" class="btn-shop">Ir a la Tienda</a>
                </div>
            `
            return
        }

        pedidos.forEach(pedido => {
            const fecha = new Date(pedido.fecha).toLocaleDateString('es-MX', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })

            let itemsHTML = ''
            
            if (pedido.items && Array.isArray(pedido.items)) {
                pedido.items.forEach(item => {
                    itemsHTML += `
                        <div class="ticket-item">
                            <span class="item-name">${item.nombre}</span>
                            <div class="item-details">
                                <span>${item.cantidad} x $${parseFloat(item.precio).toFixed(2)}</span>
                                <span class="item-subtotal">$${item.subtotal.toFixed(2)}</span>
                            </div>
                        </div>
                    `
                })
            } else {
                itemsHTML = '<div style="padding:10px; color:#999;">Detalles no disponibles</div>'
            }

            const ticket = document.createElement('div')
            ticket.className = 'ticket-card'
            ticket.innerHTML = `
                <div class="ticket-header">
                    <span class="order-id">Pedido #${pedido.id}</span>
                    <span class="order-date">${fecha}</span>
                </div>
                <div class="ticket-body">
                    ${itemsHTML}
                </div>
                <div class="ticket-footer">
                    <div class="total-row">
                        <span>TOTAL</span>
                        <span>$${parseFloat(pedido.total).toFixed(2)}</span>
                    </div>
                    <div class="status-badge ${pedido.estado}">
                        ${pedido.estado.toUpperCase()}
                    </div>
                </div>
            `
            container.appendChild(ticket)
        })

    } catch (error) {
        console.error(error)
        container.innerHTML = '<p class="error">No se pudo cargar el historial.</p>'
    }
}