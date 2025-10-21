// 🚨 ¡IMPORTANTE! Esta es la URL de tu API Gateway para obtener los productos de DynamoDB 🚨
const API_URL_BASE = 'https://dj699vbqjb.execute-api.us-east-2.amazonaws.com/default/APIProductosWeb'; 

// Objeto global para almacenar los productos en la memoria después de cargarlos de la API
window.todosLosProductos = {};

// Función para cargar todos los productos de DynamoDB a través de la API
async function cargarProductosIniciales() {
    console.log("Intentando cargar productos desde:", API_URL_BASE);
    
    try {
        const response = await fetch(API_URL_BASE);
        
        // Verifica si la respuesta HTTP es exitosa
        if (!response.ok) {
            throw new Error(`Error en la respuesta de la red: ${response.status}`);
        }
        
        const productos = await response.json();
        
        const listaProductosDiv = document.getElementById('lista-productos');
        listaProductosDiv.innerHTML = ''; // Limpiar el contenido previo
        
        if (productos.length === 0) {
             listaProductosDiv.innerHTML = '<p>No hay productos disponibles en la base de datos.</p>';
             return;
        }

        // 1. Cargar productos en la lista y en la memoria
        productos.forEach(producto => {
            // Se asume que DynamoDB devuelve IDProducto, Nombre, Precio, Descripcion (¡Cuidado con mayúsculas/minúsculas!)
            
            // Guardar en la memoria para el detalle rápido
            window.todosLosProductos[producto.IDProducto] = producto;

            // Crear el elemento en la lista
            const productoDiv = document.createElement('div');
            productoDiv.className = 'producto';
            productoDiv.setAttribute('data-id', producto.IDProducto);
            
            // Usamos las mayúsculas iniciales porque así se definieron en DynamoDB
            const nombre = producto.Nombre || 'Producto sin nombre';
            const descripcionCorta = producto.Descripcion ? producto.Descripcion.substring(0, 50) + '...' : 'Sin descripción.';
            
            productoDiv.innerHTML = `
                <h3>${nombre}</h3>
                <p>${descripcionCorta}</p>
                <button onclick="mostrarDetalle('${producto.IDProducto}')">Ver Detalles</button>
            `;
            listaProductosDiv.appendChild(productoDiv);
        });
        
        // Mostrar el detalle del primer producto al cargar (opcional)
        if (productos.length > 0) {
            mostrarDetalle(productos[0].IDProducto);
        }

    } catch (error) {
        console.error("Error al cargar productos:", error);
        document.getElementById('lista-productos').innerHTML = 
            '<p style="color: red;">Error al conectar con el backend. Revisa la consola para más detalles o verifica la URL de la API.</p>';
    }
}


// Función principal para mostrar el detalle del producto
function mostrarDetalle(idProducto) {
    // Usamos el producto que ya cargamos de la API al inicio
    const producto = window.todosLosProductos[idProducto];
    const contenedorDetalle = document.getElementById('detalle-producto');

    if (producto) {
        contenedorDetalle.innerHTML = `
            <h3>Detalle: ${producto.Nombre}</h3>
            <p><strong>Precio:</strong> ${producto.Precio || 'N/D'}</p>
            <p><strong>Descripción:</strong> ${producto.Descripcion}</p>
            <a href="https://wa.me/XXXXXXXXXX" class="btn-whatsapp" target="_blank">Comprar ${producto.Nombre}</a>
            <hr>
        `;
    } else {
        contenedorDetalle.innerHTML = '<p>Producto no encontrado en la lista.</p>';
    }
}

// Lógica de Redirección y Login (Acceso Personal)
document.getElementById('btn-personal').addEventListener('click', function(e) {
    e.preventDefault(); 
    alert("¡Bienvenido al Área Personal!\n\nSe requiere autenticación. Esta funcionalidad será implementada en la siguiente fase (Login con Cognito/API).");
});

// Llama a la función para cargar productos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', cargarProductosIniciales);
