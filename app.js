// Este es un objeto simulado (mock) de datos. 
// En una fase posterior, esta información vendrá de tu base de datos DynamoDB.
const baseDeDatos = {
    1: { 
        nombre: "ESP32 DevKit", 
        precio: "$15.00", 
        descripcion: "Módulo potente con Wi-Fi, Bluetooth y doble núcleo. Ideal para proyectos de IoT y seguridad.",
        stock: 50 
    },
    2: { 
        nombre: "Sensor de Temperatura DS18B20", 
        precio: "$5.50", 
        descripcion: "Sensor digital de temperatura sumergible, de alta precisión.",
        stock: 120 
    },
    // Aquí se agregarían más productos
};

// Función principal para mostrar el detalle del producto
function mostrarDetalle(idProducto) {
    const producto = baseDeDatos[idProducto];
    const contenedorDetalle = document.getElementById('detalle-producto');

    if (producto) {
        // Renderiza el nuevo contenido del producto
        contenedorDetalle.innerHTML = `
            <h3>Detalle: ${producto.nombre}</h3>
            <p><strong>Precio:</strong> ${producto.precio}</p>
            <p><strong>Descripción:</strong> ${producto.descripcion}</p>
            <button class="btn-whatsapp">Comprar ${producto.nombre}</button>
            <hr>
        `;
    } else {
        contenedorDetalle.innerHTML = '<p>Producto no encontrado.</p>';
    }
}

// Lógica de Redirección y Login (Acceso Personal)
document.getElementById('btn-personal').addEventListener('click', function(e) {
    e.preventDefault(); // Evita que la página salte
    
    // En la versión final, aquí iría una ventana modal (pop-up) pidiendo usuario y contraseña,
    // y luego el código de autenticación con la API de AWS Lambda/API Gateway.
    
    // Por ahora, simula el mensaje de login y la futura redirección:
    alert("¡Bienvenido al Área Personal!\n\nEsta sección requerirá Usuario y Contraseña.\n\nSerás redirigido a la página de Proyectos/ESP32 e IA...");

    // Si el login fuera exitoso, se haría la redirección:
    // window.location.href = '/dashboard-personal.html'; 
});

// Inicializa el primer producto o un mensaje de bienvenida
document.addEventListener('DOMContentLoaded', () => {
    // Puedes cargar un producto destacado por defecto si lo deseas
    // mostrarDetalle(1); 
});
