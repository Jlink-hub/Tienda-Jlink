// app.js

// 🛑 ¡IMPORTANTE! Esta es la URL de tu API Gateway para obtener los productos de DynamoDB.
// URL de invocación de tu API Gateway: dj699vbqjb
const API_URL_BASE = 'https://dj699vbqjb.execute-api.us-east-2.amazonaws.com/default/APIProductosWeb'; // URL obtenida de las etapas de tu API Gateway

// Objeto global para almacenar los productos en la memoria después de cargarlos de la API
window.todosLosProductos = {};

async function cargarProductosIniciales() {
    console.log("Intentando cargar productos desde:", API_URL_BASE);

    // Aseguramos que el contenedor de productos exista y limpiamos el contenido previo
    const listaProductosDiv = document.getElementById("lista-productos");
    if (!listaProductosDiv) {
        console.error("No se encontró el elemento con ID 'lista-productos'.");
        return;
    }
    listaProductosDiv.innerHTML = "<p>Cargando productos...</p>";

    try {
        const response = await fetch(API_URL_BASE);

        // Verifica si la petición HTTP es exitosa
        if (!response.ok) {
            throw new Error(`Error en la respuesta de la red: ${response.status}`);
        }

        // 🛑 CORRECCIÓN CRÍTICA: Manejar la doble codificación JSON de API Gateway 🛑
        const productsText = await response.text();
        let products;

        try {
            // Intenta decodificar el texto una vez
            products = JSON.parse(productsText);
            
            // Revisa si el resultado de la primera decodificación sigue siendo una cadena.
            if (typeof products === 'string') {
                // Si lo es, decodifica de nuevo (esto corrige el error "forEach is not a function")
                products = JSON.parse(products);
            }
            
        } catch (e) {
            // Si algo falla en la decodificación, asumimos que no hay productos o el formato es inválido
            console.error("Fallo al decodificar JSON:", e);
            products = []; 
        }
        // 🛑 FIN DE CORRECCIÓN 🛑
        
        // Limpiar el mensaje de "Cargando productos..."
        listaProductosDiv.innerHTML = ""; 

        // Verificamos que sea un array y que tenga elementos
        if (!Array.isArray(products) || products.length === 0) {
            listaProductosDiv.innerHTML = "<p>No hay productos disponibles en la base de datos.</p>";
            return;
        }

        // 1. Cargar productos en la lista y en la memoria
        products.forEach(producto => {
            // Se asume que DynamoDB devuelve IDProducto, Nombre, Precio, Descripcion 
            // Los datos de DynamoDB para este producto son correctos

            // Guardar en la memoria para el detalle rápido
            window.todosLosProductos[producto.IDProducto] = producto;

            // 2. Crear el elemento en la lista
            const productoDiv = document.createElement("div");
            productoDiv.className = "producto";
            productoDiv.setAttribute("data-id", producto.IDProducto);

            // Nota: La descripción larga se recorta para la vista de lista
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
