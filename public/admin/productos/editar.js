document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    const form = document.getElementById('editar-form')

    if (!id) {
        alert('ID de producto no válido')
        window.location.href = 'index.html'
        return
    }

    cargarDatos(id)

    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        
        const formData = new FormData(form)

        try {
            const response = await fetch(`/api/productos/${id}`, {
                method: 'PUT', 
                body: formData 
            })

            if (response.ok) {
                alert('Producto actualizado')
                window.location.href = 'index.html'
            } else {
                alert('Error al actualizar')
            }
        } catch (error) {
            console.error(error)
            alert('Error de conexión')
        }
    })
})

async function cargarDatos(id) {
    try {
        const response = await fetch(`/api/productos/${id}`)
        if (!response.ok) throw new Error('Error')
        
        const producto = await response.json()
        
        document.getElementById('producto-id').value = producto.id
        document.getElementById('nombre').value = producto.nombre
        document.getElementById('precio').value = producto.precio
        document.getElementById('stock').value = producto.stock
        document.getElementById('descripcion').value = producto.descripcion
        
        const imgText = document.getElementById('current-image-text')
        if (producto.imagen_url) {
            imgText.textContent = `Imagen actual: ${producto.imagen_url.split('/').pop()}`
        }

    } catch (error) {
        alert('No se pudo cargar el producto')
        window.location.href = 'index.html'
    }
}