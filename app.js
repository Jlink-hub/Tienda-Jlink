// app.js

// 🛑 ¡IMPORTANTE! Esta es la URL de tu API Gateway para obtener los productos de DynamoDB.
// URL de invocación de tu API Gateway: dj699vbqjb
const API_URL_BASE = 'https://dj699vbqjb.execute-api.us-east-2.amazonaws.com/default/APIProductosWeb';

// Objeto global para almacenar los productos en la memoria después de cargarlos de la API
window.todosLosProductos = {};

async function cargarProductosIniciales() {
    console.log("Intentando cargar productos desde:", API_URL_BASE);

    try {
        const response = await fetch(API_URL_BASE);

        // Verifica si la petición HTTP es exitosa
        if (!response.ok) {
            throw new Error(`Error en la respuesta de la red: ${response.status}`);
        }

        // 🛑 INICIO DE CORRECCIÓN: Manejar la doble codificación JSON 🛑
        const productsText = await response.text();
        let products;

        try {
            // Intenta decodificar el texto una vez
            products = JSON.parse(productsText);
        } catch (e) {
            // Si falla, significa que la API Gateway lo envió como una cadena dentro de una cadena.
            // Esto sucede si el API Gateway no está usando una integración de proxy simple.
            // Intenta decodificar dos veces:
            products = JSON.parse(JSON.parse(productsText));
        }
        // 🛑 FIN DE CORRECCIÓN 🛑
        
        const listaProductosDiv = document.getElementById("lista-productos");
        // Limpiar el contenido previo
        listaProductosDiv.innerHTML = ""; 

        // Verificamos que sea un array y no un objeto vacío o null
        if (!Array.isArray(products) || products.length === 0) {
            listaProductosDiv.innerHTML = "<p>No hay productos disponibles en la base de datos.</p>";
            return;
        }

        // 1. Cargar productos en la lista y en la memoria
        products.forEach(producto => {
            // Se asume que DynamoDB devuelve IDProducto, Nombre, Precio, Descripcion 
            // (¡Cuidado con mayúsculas/minúsculas!)

            // Guardar en la memoria para el detalle rápido
            window.todosLosProductos[producto.IDProducto] = producto;

            // 2. Crear el elemento en la lista
            const productoDiv = document.createElement("div");
            productoDiv.className = "producto";
            productoDiv.setAttribute("data-id", producto.IDProducto);

            // Nota: Se usa 'producto.Descripcion.substring(0, 150)' para evitar texto demasiado largo.
            productoDiv.innerHTML = `
                <div class="col-md-6">
                    <img src="https://via.placeholder.com/200" alt="${producto.Nombre}" class="img-fluid">
                </div>
                <div class="col-md-6">
                    <h2>${producto.Nombre}</h2>
                    <p>${producto.Descripcion.substring(0, 150)}...</p> 
                    <p><strong>Precio: $${producto.Precio}</strong></p>
                    <button onclick="verDetalle('${producto.IDProducto}')">Ver Detalle</button>
                    <a href="https://wa.me/?text=Me interesa el producto ${producto.Nombre}. Precio: $${producto.Precio}" target="_blank" class="btn btn-success mt-2">
                        Comprar por WhatsApp
                    </a>
                </div>
            `;
            listaProductosDiv.appendChild(productoDiv);
        });

    } catch (error) {
        console.error("Error al cargar productos:", error);
        const listaProductosDiv = document.getElementById("lista-productos");
        // Mostrar error, pero ahora el mensaje debería ser más limpio si la doble decodificación funciona
        listaProductosDiv.innerHTML = `<p class="alert alert-danger">Error al cargar los productos: ${error.message}</p>`;
    }
}

// Función para mostrar el detalle 
function verDetalle(id) {
    const producto = window.todosLosProductos[id];
    if (producto) {
        alert(`Detalles de ${producto.Nombre}:\n\n${producto.Descripcion}\nPrecio: $${producto.Precio}`);
    }
}


// Ejecutar la carga cuando el documento esté listo
document.addEventListener("DOMContentLoaded", cargarProductosIniciales);
