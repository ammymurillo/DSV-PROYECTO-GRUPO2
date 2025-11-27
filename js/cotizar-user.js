document.addEventListener("DOMContentLoaded", () => {

  // --- DOM ---
  const selectServicio = document.getElementById("selectServicio");
  const tablaServicios = document.getElementById("tablaServicios");
  const subtotalDOM = document.getElementById("subtotal");
  const itbmsDOM = document.getElementById("itbms");
  const totalDOM = document.getElementById("total");
  const idCotizacion = document.getElementById("idCotizacion");
  const fechaCotizacion = document.getElementById("fechaCotizacion");

  // --- LISTA ---
  let listaServicios = [];

  // === GENERAR ID Y FECHA SOLO UNA VEZ ===
  idCotizacion.textContent = "CT-" + Math.floor(Math.random() * 900000 + 100000);
  fechaCotizacion.textContent = new Date().toLocaleDateString("es-PA");

  // === CARGAR SERVICIOS DESDE servicios.js ===
  function cargarServicios() {

    selectServicio.innerHTML = "";

    [...serviciosDisponibles, ...serviciosOfertas].forEach(s => {
      const option = document.createElement("option");
      option.value = s.id;
      option.innerText = `${s.nombre} - $${s.precio}`;
      selectServicio.appendChild(option);
    });
  }

  cargarServicios();

  // === AGREGAR SERVICIO ===
  document.getElementById("btnAgregar").addEventListener("click", () => {

    const idServicio = parseInt(selectServicio.value);

    const servicio =
      serviciosDisponibles.find(s => s.id === idServicio) ||
      serviciosOfertas.find(s => s.id === idServicio);

    listaServicios.push(servicio);

    actualizarTabla();
    calcularTotales();
  });

  // === ACTUALIZAR TABLA ===
  function actualizarTabla() {
    tablaServicios.innerHTML = "";

    listaServicios.forEach((s, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${s.nombre}</td>
        <td>$${s.precio.toFixed(2)}</td>
        <td><button class="remove-btn" onclick="eliminar(${index})">X</button></td>
      `;

      tablaServicios.appendChild(row);
    });
  }

  // === ELIMINAR SERVICIO ===
  function eliminar(index) {
    listaServicios.splice(index, 1);
    actualizarTabla();
    calcularTotales();
  }

  // hacer accesible la función al HTML
  window.eliminar = eliminar;

  // === CALCULAR TOTALES ===
  function calcularTotales() {
    const subtotal = listaServicios.reduce((t, s) => t + s.precio, 0);
    const itbms = subtotal * 0.07;
    const total = subtotal + itbms;

    subtotalDOM.innerText = `$${subtotal.toFixed(2)}`;
    itbmsDOM.innerText = `$${itbms.toFixed(2)}`;
    totalDOM.innerText = `$${total.toFixed(2)}`;
  }

  // === IMPRIMIR ===
  document.getElementById("btnImprimir").addEventListener("click", () => {
    window.print();
  });

});

