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
    document.addEventListener('DOMContentLoaded', () => {
    const listaHistorial = document.getElementById('listaHistorial');

    const buscarCliente = document.getElementById('buscarCliente');
    const fechaDesde = document.getElementById('fechaDesde');
    const fechaHasta = document.getElementById('fechaHasta');
    const btnFiltrar = document.getElementById('btnFiltrar');
    const btnLimpiar = document.getElementById('btnLimpiar');

    // Guardamos todas las filas originales
    const filasOriginales = Array.from(listaHistorial.querySelectorAll('tr'));

    function filtrarTabla() {
        const clienteFiltro = buscarCliente.value.toLowerCase();
        const desde = fechaDesde.value;
        const hasta = fechaHasta.value;

        filasOriginales.forEach(fila => {
            const celdas = fila.querySelectorAll('td');
            const fecha = celdas[0].textContent.trim();
            const cliente = celdas[2].textContent.trim().toLowerCase();

            let mostrar = true;

            if (clienteFiltro && !cliente.includes(clienteFiltro)) mostrar = false;
            if (desde && fecha < desde) mostrar = false;
            if (hasta && fecha > hasta) mostrar = false;

            fila.style.display = mostrar ? '' : 'none';
        });
    }

    btnFiltrar.addEventListener('click', filtrarTabla);

    btnLimpiar.addEventListener('click', () => {
        buscarCliente.value = '';
        fechaDesde.value = '';
        fechaHasta.value = '';
        filasOriginales.forEach(fila => fila.style.display = '');
    });
});
});
