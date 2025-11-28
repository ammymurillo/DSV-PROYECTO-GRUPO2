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
});
