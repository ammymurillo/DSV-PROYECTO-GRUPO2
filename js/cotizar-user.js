document.addEventListener("DOMContentLoaded", () => {

  // --- DOM ---
  const selectServicio = document.getElementById("selectServicio");
  const tablaServicios = document.getElementById("tablaServicios");
  const subtotalDOM = document.getElementById("subtotal");
  const itbmsDOM = document.getElementById("itbms");
  const totalDOM = document.getElementById("total");
  const idCotizacion = document.getElementById("idCotizacion");
  const fechaCotizacion = document.getElementById("fechaCotizacion");

  // --- Datos ---
  let listaCotizacion = [];

  // generar ID de cotización
  idCotizacion.textContent = "CT-" + Math.floor(Math.random() * 999999);
  fechaCotizacion.textContent = new Date().toLocaleDateString("es-PA");

  // =========================
  //   1. Cargar servicios desde servicios.js
  // =========================

  if (typeof services !== "undefined") {
    services.forEach(s => {
      const option = document.createElement("option");
      option.value = s.price;
      option.dataset.nombre = s.name;
      option.textContent = `${s.name} - $${s.price.toFixed(2)}`;
      selectServicio.appendChild(option);
    });
  }

  // =========================
  //   2. Agregar servicio a la cotización
  // =========================

  document.getElementById("btnAgregar").addEventListener("click", () => {
    const selected = selectServicio.options[selectServicio.selectedIndex];

    const servicio = {
      nombre: selected.dataset.nombre,
      precio: parseFloat(selected.value)
    };

    listaCotizacion.push(servicio);
    renderTabla();
  });

  // =========================
  //   3. Renderizar tabla
  // =========================

  function renderTabla() {
    tablaServicios.innerHTML = "";

    listaCotizacion.forEach((item, index) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${item.nombre}</td>
        <td>$${item.precio.toFixed(2)}</td>
        <td><button class="btn-delete" data-index="${index}">X</button></td>
      `;

      tablaServicios.appendChild(tr);
    });

    calcularTotales();
    agregarEventosEliminar();
  }

  function agregarEventosEliminar() {
    document.querySelectorAll(".btn-delete").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        listaCotizacion.splice(index, 1);
        renderTabla();
      });
    });
  }

  // =========================
  //   4. Calcular totales
  // =========================

  function calcularTotales() {
    const subtotal = listaCotizacion.reduce((acc, s) => acc + s.precio, 0);
    const itbms = subtotal * 0.07;
    const total = subtotal + itbms;

    subtotalDOM.textContent = "$" + subtotal.toFixed(2);
    itbmsDOM.textContent = "$" + itbms.toFixed(2);
    totalDOM.textContent = "$" + total.toFixed(2);
  }

  // =========================
  //   5. Imprimir factura
  // =========================

  document.getElementById("btnImprimir").addEventListener("click", () => {
    window.print();
  });
});
