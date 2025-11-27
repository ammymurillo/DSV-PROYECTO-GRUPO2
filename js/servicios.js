// servicios.js
// Nota: este archivo ahora expone `window.serviciosDisponibles` y `window.serviciosOfertas`
// para que otros scripts (ej. cotizar.js) puedan leerlos.

document.addEventListener('DOMContentLoaded', () => {
  const services = [
    // PC
    { tipo: "pc", name: "Mantenimiento Preventivo PC", price: 35.00, old: 49.00, desc: "Limpieza interna (polvo), verificación de ventiladores y optimización del sistema.", specs:["Limpieza física","Optimización S.O.","Revisión hardware"] },
    { tipo: "pc", name: "Formateo e Instalación SO", price: 50.00, old: 79.00, desc: "Instalación Windows/Linux, drivers y programas básicos. Respaldo opcional.", specs:["Instalación S.O.","Drivers","Configuración básica"] },
    { tipo: "pc", name: "Remoción de Malware", price: 45.00, old: 89.00, desc: "Eliminación de virus, malware, adware y limpieza de registros.", specs:["Análisis antivirus","Eliminación amenazas","Reporte final"] },
    { tipo: "pc", name: "Soporte Remoto (por hora)", price: 20.00, old: null, desc: "Asistencia remota para configuración, dudas o soporte técnico.", specs:["Acceso remoto seguro","Resolución de incidencias"] },
    { tipo: "pc", name: "Instalación de Programas", price: 15.00, old: null, desc: "Instalación y configuración de suites, navegadores y herramientas.", specs:["Office / Suites","Browsers","Utilidades"] },

    // Laptop
    { tipo: "laptop", name: "Mantenimiento Laptop + Pasta Térmica", price: 55.00, old: 85.00, desc: "Limpieza interna, cambio de pasta térmica y revisión de ventilación.", specs:["Desarme seguro","Pasta premium","Pruebas de temperatura"] },
    { tipo: "laptop", name: "Reparación/ Cambio de Teclado", price: 40.00, old: 69.00, desc: "Reemplazo o limpieza profunda de teclado integrado.", specs:["Reemplazo","Limpieza de contactos"] },
    { tipo: "laptop", name: "Cambio a SSD + Clonación", price:60.00, old: null, desc: "Instalación de SSD, clonación de disco y optimización.", specs:["Clonación segura","Instalación S.O.","Optimización SSD"] },

    // Redes
    { tipo: "network", name: "Configuración de Red Hogar", price: 120.00, old: null, desc: "Optimización WiFi, colocación de repetidores y seguridad.", specs:["Optimización WiFi","Seguridad básica","Cobertura mejorada"] },
    { tipo: "network", name: "Instalación de Cámaras IP", price: 230.50, old: 350.00, desc: "Montaje, configuración y visualización remota de cámaras.", specs:["Montaje","Configuración NVR","Acceso remoto"] }
  ];

  // --- Convertir a la forma que espera el cotizador ---
  // Creamos arrays con campos 'id','nombre','precio' para compatibilidad
  const serviciosDisponibles = services.map((s, i) => ({
    id: i + 1,
    nombre: s.name,
    precio: s.price,
    tipo: s.tipo,
    desc: s.desc,
    old: s.old,
    specs: s.specs
  }));

  // Si tienes ofertas separadas, aquí podrías filtrarlas. Por ahora dejamos vacío.
  const serviciosOfertas = []; // puedes añadir objetos {id, nombre, precio} si tienes ofertas

  // Exponer en window para que cotizar.js pueda leerlos
  window.serviciosDisponibles = serviciosDisponibles;
  window.serviciosOfertas = serviciosOfertas;

  // --- Render del grid original (tu código existente) ---
  const grid = document.getElementById('servicesGrid');
  const toggles = document.querySelectorAll('.toggle');
  const search = document.getElementById('search');

  function iconSVG(tipo){
    if(tipo === 'pc') return `<svg ...>...</svg>`;
    if(tipo === 'laptop') return `<svg ...>...</svg>`;
    if(tipo === 'network') return `<svg ...>...</svg>`;
    return '';
  }

  function render(type = 'pc', filter = ''){
    if(!grid) return;
    grid.innerHTML = '';
    const list = services.filter(s => s.tipo === type && (s.name.toLowerCase().includes(filter.toLowerCase()) || s.desc.toLowerCase().includes(filter.toLowerCase())));
    if(list.length === 0){
      grid.innerHTML = `<p style="grid-column:1/-1; opacity:.9;">No se encontraron servicios.</p>`;
      return;
    }

    list.forEach((s, idx) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <div class="row">
          <div class="icon">${iconSVG(s.tipo)}</div>
          <div style="flex:1">
            <h3>${s.name}</h3>
            <div>
              ${s.old ? `<span class="price-old">$${s.old.toFixed(2)}</span>` : ''}
              <span class="price">$${s.price.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <p class="desc">${s.desc}</p>
        <ul class="specs">${s.specs.map(x=>`<li>${x}</li>`).join('')}</ul>
        <button class="btn" data-name="${s.name}" data-price="${s.price}">Seleccionar</button>
      `;
      grid.appendChild(card);

      setTimeout(()=> card.classList.add('visible'), 80 * idx);

      // Al pulsar "Seleccionar" — opción: si existe window.addToCotizacion lo llamamos
      card.querySelector('.btn').addEventListener('click', (e) => {
        const nombre = e.currentTarget.dataset.name;
        const precio = parseFloat(e.currentTarget.dataset.price);
        if(window.addToCotizacion && typeof window.addToCotizacion === 'function') {
          // enviamos objeto simple al cotizador
          window.addToCotizacion({ nombre, precio });
        } else {
          // comportamiento por defecto: mostrar alerta
          alert(`Servicio seleccionado:\n${nombre}\nPrecio: $${precio.toFixed(2)}`);
        }
      });
    });
  }

  toggles.forEach(btn => {
    btn.addEventListener('click', ()=> {
      toggles.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.type, search.value || '');
    });
  });

  let debounce;
  if(search) {
    search.addEventListener('input', e=>{
      clearTimeout(debounce);
      debounce = setTimeout(()=> {
        const activeType = document.querySelector('.toggle.active')?.dataset.type || 'pc';
        render(activeType, e.target.value);
      }, 180);
    });
  }

  render('pc');

  // IntersectionObserver opcional
  setTimeout(()=> {
    document.querySelectorAll('.card').forEach(c => {
      c.style.transform = 'translateY(0)';
    });
  }, 300);

});

