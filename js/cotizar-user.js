// cotizar.js
document.addEventListener("DOMContentLoaded", () => {

  // DOM
  const selectServicio = document.getElementById("selectServicio");
  const tablaServicios = document.getElementById("tablaServicios");
  const subtotalDOM = document.getElementById("subtotal");
  const itbmsDOM = document.getElementById("itbms");
  const totalDOM = document.getElementById("total");
  const idCotizacion = document.getElementById("idCotizacion");
  const fechaCotizacion = document.getElementById("fechaCotizacion");
  const nombreClienteInput = document.getElementById("nombreCliente");

  if(!selectServicio) {
    console.error("cotizar.js: no se encontró #selectServicio en el DOM.");
    return;
  }

  // lista local
  let listaServicios = [];

  // generar ID y fecha una sola vez
  idCotizacion.textContent = "CT-" + Math.floor(Math.random() * 900000 + 100000);
  fechaCotizacion.textContent = new Date().toLocaleDateString("es-PA");

  // --- Helper: obtener servicios desde diferentes posibles nombres ---
  function obtenerArraysServicios() {
    // prioridad: serviciosDisponibles / serviciosOfertas
    if (window.serviciosDisponibles) {
      return {
        disponibles: window.serviciosDisponibles,
        ofertas: window.serviciosOfertas || []
      };
    }
    // fallback: si existe 'services' (tu archivo original)
    if (window.services) {
      const map = window.services.map((s, i) => ({
        id: i+1,
        nombre: s.name,
        precio: s.price
      }));
      return { disponibles: map, ofertas: [] };
    }
    // nada encontrado
    return { disponibles: [], ofertas: [] };
  }

  const { disponibles, ofertas } = obtenerArraysServicios();

  if(disponibles.length === 0) {
    console.warn("cotizar.js: no se encontraron servicios. Revisa que js/servicios.js exporte `window.serviciosDisponibles` o `window.services`.");
    selectServicio.innerHTML = `<option value="">-- No hay servicios cargados --</option>`;
  } else {
    // cargar select combinando disponibles + ofertas
    selectServicio.innerHTML = "";
    [...disponibles, ...ofertas].forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.id;
      opt.dataset.nombre = s.nombre;
      opt.dataset.precio = Number(s.precio ?? s.price ?? 0).toFixed(2);
      opt.textContent = `${s.nombre} — $${Number(opt.dataset.precio).toFixed(2)}`;
      selectServicio.appendChild(opt);
    });
  }

  // Permitir que servicios del grid llamen directamente para añadir:
  // window.addToCotizacion({nombre, precio})
  window.addToCotizacion = function(obj) {
    if(!obj || !obj.nombre) return;
    const item = { nombre: obj.nombre, precio: Number(obj.precio || obj.price || 0) };
    listaServicios.push(item);
    actualizarTabla();
    calcularTotales();
  };

  // Agregar servicio desde select
  document.getElementById("btnAgregar").addEventListener("click", () => {
    const opt = selectServicio.options[selectServicio.selectedIndex];
    if(!opt) return;
    const servicio = {
      nombre: opt.dataset.nombre,
      precio: parseFloat(opt.dataset.precio)
    };
    listaServicios.push(servicio);
    actualizarTabla();
    calcularTotales();
  });

  // actualizar tabla
  function actualizarTabla(){
    tablaServicios.innerHTML = "";
    listaServicios.forEach((s, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${s.nombre}</td>
        <td>$${s.precio.toFixed(2)}</td>
        <td><button class="remove-btn" data-index="${i}">X</button></td>
      `;
      tablaServicios.appendChild(row);
    });

    // attach eliminar handlers (delegación)
    tablaServicios.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index);
        listaServicios.splice(idx, 1);
        actualizarTabla();
        calcularTotales();
      });
    });
  }

  // calcular totales
  function calcularTotales(){
    const subtotal = listaServicios.reduce((acc, s) => acc + Number(s.precio || 0), 0);
    const itbms = subtotal * 0.07;
    const total = subtotal + itbms;
    subtotalDOM.innerText = `$${subtotal.toFixed(2)}`;
    itbmsDOM.innerText = `$${itbms.toFixed(2)}`;
    totalDOM.innerText = `$${total.toFixed(2)}`;
  }

  // imprimir
  document.getElementById("btnImprimir").addEventListener("click", () => {
    // incluir nombre del cliente como título opcional en impresión
    if(nombreClienteInput && nombreClienteInput.value.trim()) {
      const prevTitle = document.title;
      document.title = `Cotización - ${nombreClienteInput.value.trim()}`;
      window.print();
      document.title = prevTitle;
      return;
    }
    window.print();
  });

});
