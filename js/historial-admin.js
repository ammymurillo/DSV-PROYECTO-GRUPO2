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
    const listaHistorial = document.getElementById("listaHistorial");
    const filasOriginales = Array.from(listaHistorial.querySelectorAll("tr"));

    const buscarCliente = document.getElementById("buscarCliente");
    const fechaDesde = document.getElementById("fechaDesde");
    const fechaHasta = document.getElementById("fechaHasta");

    function filtrarTabla() {
        const clienteFiltro = buscarCliente.value.toLowerCase();

        // Convertir valores de los inputs de fecha a Date
        const desdeDate = fechaDesde.value ? new Date(fechaDesde.value) : null;
        const hastaDate = fechaHasta.value ? new Date(fechaHasta.value) : null;

        filasOriginales.forEach(fila => {
            const celdas = fila.querySelectorAll("td");
            const cliente = celdas[2].textContent.trim().toLowerCase();

            // Convertir fecha de la tabla a Date
            const fechaTabla = new Date(celdas[0].textContent.trim());

            let mostrar = true;

            if (clienteFiltro && !cliente.includes(clienteFiltro)) mostrar = false;
            if (desdeDate && fechaTabla < desdeDate) mostrar = false;
            if (hastaDate && fechaTabla > hastaDate) mostrar = false;

            fila.style.display = mostrar ? "" : "none";
        });
    }

    // Filtrar en tiempo real
    buscarCliente.addEventListener("input", filtrarTabla);
    fechaDesde.addEventListener("change", filtrarTabla);
    fechaHasta.addEventListener("change", filtrarTabla);
});
});
