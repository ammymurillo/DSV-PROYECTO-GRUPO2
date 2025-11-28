document.addEventListener("DOMContentLoaded", () => {

  // 1️ Esperar a que servicios.js cargue
  setTimeout(() => {
    if (!window.serviciosDisponibles) {
      console.error("⚠ servicios.js no se ha cargado.");
      return;
    }

    const select = document.getElementById("servicioSelect");
    const tabla = document.querySelector("#tablaServicios tbody");
    const subtotalEl = document.getElementById("subtotal");
    const impuestoEl = document.getElementById("impuesto");
    const totalEl = document.getElementById("total");

    // ----------------------------
    // 2️ Llenar el SELECT
    // ----------------------------
    window.serviciosDisponibles.forEach(serv => {
      const op = document.createElement("option");
      op.value = serv.id;
      op.dataset.precio = serv.precio;
      op.textContent = `${serv.nombre} — $${serv.precio.toFixed(2)}`;
      select.appendChild(op);
    });

    // ----------------------------
    // 3️ Agregar servicio a la tabla
    // ----------------------------
    document.getElementById("btnAgregar").addEventListener("click", () => {
      const selected = select.options[select.selectedIndex];
      if (!selected || !selected.value) return;

      const nombre = selected.textContent.split(" — ")[0];
      const precio = parseFloat(selected.dataset.precio);

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${nombre}</td>
        <td>$${precio.toFixed(2)}</td>
        <td><button class="delete-btn">❌</button></td>
      `;

      tabla.appendChild(row);
      calcularTotales();
    });

    // ----------------------------
    // 4️ Eliminar servicio
    // ----------------------------
    tabla.addEventListener("click", e => {
      if (e.target.classList.contains("delete-btn")) {
        e.target.closest("tr").remove();
        calcularTotales();
      }
    });

    // ----------------------------
    // 5️ Calcular totales
    // ----------------------------
    function calcularTotales() {
      let subtotal = 0;

      tabla.querySelectorAll("tr").forEach(row => {
        const precio = parseFloat(row.children[1].textContent.replace("$", ""));
        subtotal += precio;
      });

      const impuesto = subtotal * 0.07;
      const total = subtotal + impuesto;

      subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
      impuestoEl.textContent = `$${impuesto.toFixed(2)}`;
      totalEl.textContent = `$${total.toFixed(2)}`;
    }

  }, 300); // retraso para asegurar que servicios.js cargó
});

