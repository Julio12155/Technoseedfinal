document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('crear-form')

    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        
        const inputs = form.querySelectorAll('input, textarea')
        inputs.forEach(input => {
            input.style.border = '1px solid #ccc'
            input.style.backgroundColor = 'white'
        })

        const formData = new FormData(form)

        if (!formData.get('nombre') || !formData.get('precio') || !formData.get('stock')) {
            alert('Por favor completa los campos obligatorios')
            return
        }

        try {
            const response = await fetch('/api/productos', {
                method: 'POST',
                body: formData 
            })

            if (response.ok) {
                alert('Producto creado exitosamente')
                window.location.href = 'index.html'
            } else {
                const error = await response.json()
                alert('Error: ' + error.error)
                highlightError()
            }
        } catch (error) {
            console.error(error)
            alert('Error de conexión')
        }
    })

    function highlightError() {
        const required = ['nombre', 'precio', 'stock']
        required.forEach(id => {
            const el = document.getElementById(id)
            if (!el.value) {
                el.style.border = '2px solid #c0392b'
                el.style.backgroundColor = '#fadbd8'
            }
        })
    }
})