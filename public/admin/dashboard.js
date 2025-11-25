document.addEventListener('DOMContentLoaded', () => {
    cargarEstadisticas()
})

async function cargarEstadisticas() {
    try {
        const response = await fetch('/api/admin/stats')
        const result = await response.json()

        if (result.success) {
            const { productos, clientes, ventas, pedidos } = result.data
            
            animateValue('stat-products', 0, productos, 1000)
            animateValue('stat-clients', 0, clientes, 1000)
            
            document.getElementById('stat-sales').textContent = `$${ventas}`
            document.getElementById('stat-orders').textContent = pedidos
        }
    } catch (error) {
        console.error('Error cargando dashboard:', error)
    }
}

function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id)
    if (!obj) return
    
    let startTimestamp = null
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp
        const progress = Math.min((timestamp - startTimestamp) / duration, 1)
        obj.textContent = Math.floor(progress * (end - start) + start)
        if (progress < 1) {
            window.requestAnimationFrame(step)
        }
    }
    window.requestAnimationFrame(step)
}