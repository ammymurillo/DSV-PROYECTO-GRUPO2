document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("listaHistorial");
    const historial = JSON.parse(localStorage.getItem("historialAdmin")) || [];

    // Si no hay cotizaciones
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

    // Crear filas dinámicamente
    historial.forEach(item => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${item.fecha}</td>
            <td>${item.numero}</td>
            <td>${item.cliente}</td>
            <td>$${item.subtotal}</td>
            <td>$${item.itbms}</td>
            <td>$${item.total}</td>
        `;
        tabla.appendChild(fila);
    });

    // Guardar todas las filas originales para filtrar
    const filasOriginales = Array.from(tabla.querySelectorAll("tr"));

    // Elementos de filtros
    const buscarCliente = document.getElementById("buscarCliente");
    const fechaDesde = document.getElementById("fechaDesde");
    const fechaHasta = document.getElementById("fechaHasta");
    const btnLimpiar = document.getElementById("btnLimpiar");

    function filtrarTabla() {
        const clienteFiltro = buscarCliente.value.toLowerCase();
        const desdeDate = fechaDesde.value ? new Date(fechaDesde.value) : null;
        const hastaDate = fechaHasta.value ? new Date(fechaHasta.value) : null;

        filasOriginales.forEach(fila => {
            const celdas = fila.querySelectorAll("td");
            const cliente = celdas[2].textContent.trim().toLowerCase();
            const fechaTabla = new Date(celdas[0].textContent.trim());

            let mostrar = true;
            if (clienteFiltro && !cliente.includes(clienteFiltro)) mostrar = false;
            if (desdeDate && fechaTabla < desdeDate) mostrar = false;
            if (hastaDate && fechaTabla > hastaDate) mostrar = false;

            fila.style.display = mostrar ? "" : "none";
        });
    }

    // Eventos
    buscarCliente.addEventListener("input", filtrarTabla);
    fechaDesde.addEventListener("change", filtrarTabla);
    fechaHasta.addEventListener("change", filtrarTabla);

    btnLimpiar.addEventListener("click", () => {
        buscarCliente.value = "";
        fechaDesde.value = "";
        fechaHasta.value = "";
        filasOriginales.forEach(fila => fila.style.display = "");
    });
});
