// URL de tu API Gateway
const API_URL_BASE = 'https://dj699vbqjb.execute-api.us-east-2.amazonaws.com/default/APIProductosWeb';

// Memoria local de productos
window.todosLosProductos = {};

async function cargarProductosIniciales() {
    const listaProductosDiv = document.getElementById("lista-productos");
    if (!listaProductosDiv) return;

    try {
        const response = await fetch(API_URL_BASE);
        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const apiResponse = await response.json(); 
        const productsJSONString = apiResponse.body; 
        let products = productsJSONString ? JSON.parse(productsJSONString) : [];
        
        listaProductosDiv.innerHTML = ""; 

        if (products.length === 0) {
            listaProductosDiv.innerHTML = "<p>No hay productos disponibles actualmente.</p>";
            return;
        }

        products.forEach(producto => {
            // Guardamos en memoria
            window.todosLosProductos[producto.IDProducto] = producto;

            // Creamos la tarjeta (Card)
            const productoCard = document.createElement("div");
            productoCard.className = "producto-card";
            
            const imagenSrc = producto.URLImagen || 'https://via.placeholder.com/200?text=Sin+Imagen';

            productoCard.innerHTML = `
                <div class="card-img-container">
                    <img src="${imagenSrc}" alt="${producto.Nombre}">
                </div>
                <div class="card-info">
                    <h2 class="prod-nombre">${producto.Nombre}</h2>
                    <p class="prod-desc">${producto.Descripcion.substring(0, 80)}...</p>
                    <p class="prod-precio">$${producto.Precio}</p>
                    <div class="card-buttons">
                        <button class="btn-detalle" onclick="verDetalle('${producto.IDProducto}')">Detalles</button>
                        <a href="https://wa.me/593997419277?text=Hola, me interesa el producto: ${producto.Nombre}" 
                           target="_blank" class="btn-comprar">
                           WhatsApp
                        </a>
                    </div>
                </div>
            `;
            listaProductosDiv.appendChild(productoCard);
        });

    } catch (error) {
        console.error("Error:", error);
        listaProductosDiv.innerHTML = `<p class="error-msg">Error al conectar con el servidor.</p>`;
    }
}

// LÓGICA DE BÚSQUEDA
function filtrarProductos() {
    const query = document.getElementById("busqueda").value.toLowerCase();
    const cards = document.querySelectorAll(".producto-card");

    cards.forEach(card => {
        const nombre = card.querySelector(".prod-nombre").innerText.toLowerCase();
        const descripcion = card.querySelector(".prod-desc").innerText.toLowerCase();

        if (nombre.includes(query) || descripcion.includes(query)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

function verDetalle(id) {
    const p = window.todosLosProductos[id];
    if (p) {
        alert(`📦 ${p.Nombre}\n\n📝 ${p.Descripcion}\n\n💰 Precio: $${p.Precio}`);
    }
}

document.addEventListener("DOMContentLoaded", cargarProductosIniciales);
