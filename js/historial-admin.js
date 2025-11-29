document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("listaHistorial");
    const historial = JSON.parse(localStorage.getItem("historialAdmin")) || [];

    if(historial.length === 0){
        tabla.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding:20px;">
                    No hay cotizaciones registradas.
                </td>
            </tr>
        `;
        return;
    }

    historial.forEach(item => {
        const fila = `
            <tr>
                <td>${item.fecha}</td>
                <td>${item.numero}</td>
                <td>${item.cliente}</td>
                <td>$${item.subtotal}</td>
                <td>$${item.itbms}</td>
                <td>$${item.total}</td>
            </tr>
        `;
        tabla.innerHTML += fila;
    });
    
//filtro
    document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("listaHistorial");

    // Obtener historial desde localStorage
    const historial = JSON.parse(localStorage.getItem("historialAdmin")) || [];

    if(historial.length === 0){
        tabla.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding:20px;">
                    No hay cotizaciones registradas.
                </td>
            </tr>
        `;
        return;
    }

    // Crear filas en la tabla
    historial.forEach(item => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${item.fecha}</td>
            <td>${item.numero}</td>
            <td>${item.cliente}</td>
            <td>$${item.subtotal.toFixed(2)}</td>
            <td>$${item.itbms.toFixed(2)}</td>
            <td>$${item.total.toFixed(2)}</td>
        `;
        tabla.appendChild(fila);
    });

    // Guardar todas las filas originales para filtrar
    const filasOriginales = Array.from(tabla.querySelectorAll("tr"));

    // Elementos de filtros
    const buscarCliente = document.getElementById("buscarCliente");
    const fechaDesde = document.getElementById("fechaDesde");
    const fechaHasta = document.getElementById("fechaHasta");

    // Función para filtrar
    function filtrarTabla() {
        const clienteFiltro = buscarCliente.value.toLowerCase();
        const desde = fechaDesde.value;
        const hasta = fechaHasta.value;

        filasOriginales.forEach(fila => {
            const celdas = fila.querySelectorAll("td");
            const fecha = celdas[0].textContent.trim();
            const cliente = celdas[2].textContent.trim().toLowerCase();

            let mostrar = true;

            if (clienteFiltro && !cliente.includes(clienteFiltro)) mostrar = false;
            if (desde && fecha < desde) mostrar = false;
            if (hasta && fecha > hasta) mostrar = false;

            fila.style.display = mostrar ? "" : "none";
        });
    }

    // Filtrar en tiempo real
    buscarCliente.addEventListener("input", filtrarTabla);
    fechaDesde.addEventListener("change", filtrarTabla);
    fechaHasta.addEventListener("change", filtrarTabla);
});
});
