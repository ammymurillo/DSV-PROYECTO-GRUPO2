// ===========================
// BASE DE DATOS TEMPORAL
// ===========================
function obtenerClientesDesdeTabla() {
    const tabla = document.querySelector("#tablaClientes tbody");
    const filas = tabla.querySelectorAll("tr");

    const clientes = [];

    filas.forEach(fila => {
        const columnas = fila.querySelectorAll("td");

        const nombre = columnas[0].textContent.trim();
        const email = columnas[1].textContent.trim();
        const telefono = columnas[2].textContent.trim();

        clientes.push({ nombre, email, telefono });
    });

    return clientes;
}


document.getElementById("btnBuscarCliente").addEventListener("click", () => {

    const input = document.getElementById("clienteInput").value.trim().toLowerCase();

    if (input === "") {
        alert("Ingrese un nombre.");
        return;
    }

    // AHORA SÍ LEE LA TABLA DIRECTAMENTE
    const clientes = obtenerClientesDesdeTabla();

    const existe = clientes.some(c =>
        c.nombre.toLowerCase() === input ||
        c.nombre.toLowerCase().includes(input)
    );

    if (!existe) {
        alert("El cliente NO existe. Regístrelo primero.");
        window.location.href = "clientes.html";
        return;
    }

    document.getElementById("clienteValido").hidden = false;
    alert("Cliente verificado ✔");
});


// ===========================
// AGREGAR SERVICIOS A LA LISTA
// ===========================
const listaServicios = [];
const contenedorLista = document.getElementById("listaServicios");

document.getElementById("btnAgregar").addEventListener("click", () => {

    const nombreServicio = document.getElementById("servicioSelect").value;
    const cantidad = parseInt(document.getElementById("cantidad").value);

    const servicio = serviciosDB.find(s => s.nombre === nombreServicio);

    listaServicios.push({
        nombre: servicio.nombre,
        precio: servicio.precio,
        cantidad: cantidad,
        subtotal: servicio.precio * cantidad,
        impuesto: servicio.precio * cantidad * 0.07 // ITBMS 7%
    });

    renderizarLista();
});


// ===========================
// MOSTRAR SERVICIOS AGREGADOS
// ===========================
function renderizarLista() {
    contenedorLista.innerHTML = "";

    listaServicios.forEach((s, index) => {
        const item = document.createElement("div");
        item.className = "servicio-item";

        item.innerHTML = `
            <p><strong>${s.nombre}</strong> (x${s.cantidad})</p>
            <p>Subtotal: $${s.subtotal.toFixed(2)}</p>
            <p>ITBMS: $${s.impuesto.toFixed(2)}</p>
            <button class="btn-delete" data-i="${index}">Eliminar</button>
        `;

        contenedorLista.appendChild(item);
    });

    // Eliminar servicio
    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const i = e.target.dataset.i;
            listaServicios.splice(i, 1);
            renderizarLista();
        });
    });
}


// ===========================
// GENERAR COTIZACIÓN / FACTURA
// ===========================
document.getElementById("formCotizacion").addEventListener("submit", (e) => {
    e.preventDefault();

    if (listaServicios.length === 0) {
        alert("Agregue al menos un servicio.");
        return;
    }

    const fecha = document.getElementById("fechaCotizacion").value;
    const cliente = document.getElementById("clienteInput").value;

    let subtotal = 0;
    let impuesto = 0;

    listaServicios.forEach(s => {
        subtotal += s.subtotal;
        impuesto += s.impuesto;
    });

    const total = subtotal + impuesto;

    const factura = `
        <h3>Factura</h3>
        <p><strong>Cliente:</strong> ${cliente}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>

        <h4>Servicios:</h4>
        <ul>
            ${listaServicios.map(s => `
                <li>${s.nombre} (x${s.cantidad}) - $${s.subtotal.toFixed(2)} + ITBMS $${s.impuesto.toFixed(2)}</li>
            `).join("")}
        </ul>

        <hr>
        <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
        <p><strong>ITBMS:</strong> $${impuesto.toFixed(2)}</p>
        <p><strong>Total:</strong> $${total.toFixed(2)}</p>
    `;

    const resultado = document.getElementById("resultadoCot");
    resultado.innerHTML = factura;
    resultado.hidden = false;
});
