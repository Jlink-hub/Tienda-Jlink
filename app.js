const API_URL_BASE = 'https://dj699vbqjb.execute-api.us-east-2.amazonaws.com/default/APIProductosWeb';
window.todosLosProductos = {};

// Función de búsqueda (se activa al escribir o al dar clic)
function filtrarProductos() {
    const textoBuscado = document.getElementById("busqueda").value.toLowerCase().trim();
    const tarjetas = document.querySelectorAll(".producto-card");

    tarjetas.forEach(tarjeta => {
        const nombre = tarjeta.querySelector(".prod-nombre").innerText.toLowerCase();
        const descripcion = tarjeta.querySelector(".prod-desc").innerText.toLowerCase();

        if (nombre.includes(textoBuscado) || descripcion.includes(textoBuscado)) {
            tarjeta.style.display = "block"; // Muestra si coincide
        } else {
            tarjeta.style.display = "none";  // Oculta si no coincide
        }
    });
}

async function cargarProductosIniciales() {
    const contenedor = document.getElementById("lista-productos");
    
    try {
        const response = await fetch(API_URL_BASE);
        const data = await response.json();
        const productos = JSON.parse(data.body);

        contenedor.innerHTML = ""; // Limpiamos el cargando

        productos.forEach(p => {
            window.todosLosProductos[p.IDProducto] = p;
            const card = document.createElement("div");
            card.className = "producto-card";
            
            card.innerHTML = `
                <img src="${p.URLImagen || 'https://via.placeholder.com/200'}" alt="${p.Nombre}">
                <h2 class="prod-nombre">${p.Nombre}</h2>
                <p class="prod-desc">${p.Descripcion.substring(0, 100)}...</p>
                <p class="prod-precio">$${p.Precio}</p>
                <div class="acciones">
                    <button onclick="verDetalle('${p.IDProducto}')" style="padding: 8px; cursor:pointer;">Ver Más</button>
                    <a href="https://wa.me/593997419277?text=Me interesa: ${p.Nombre}" target="_blank" class="btn-comprar">WhatsApp</a>
                </div>
            `;
            contenedor.appendChild(card);
        });
    } catch (e) {
        contenedor.innerHTML = "Error al cargar productos.";
    }
}

function verDetalle(id) {
    const p = window.todosLosProductos[id];
    alert(`PRODUCTO: ${p.Nombre}\n\n${p.Descripcion}\n\nPRECIO: $${p.Precio}`);
}

document.addEventListener("DOMContentLoaded", cargarProductosIniciales);
