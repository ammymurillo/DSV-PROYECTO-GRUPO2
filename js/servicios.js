// servicios.js
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

  const grid = document.getElementById('servicesGrid');
  const toggles = document.querySelectorAll('.toggle');
  const search = document.getElementById('search');

  // small SVG icons by category (return svg string)
  function iconSVG(tipo){
    if(tipo === 'pc') return `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="3" width="20" height="13" rx="2" stroke="rgba(255,255,255,0.9)" stroke-width="1.2"/><path d="M8 20h8" stroke="rgba(255,255,255,0.9)" stroke-width="1.2" stroke-linecap="round"/></svg>`;
    if(tipo === 'laptop') return `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="5" width="18" height="11" rx="1.5" stroke="rgba(255,255,255,0.9)" stroke-width="1.2"/><path d="M2 20h20" stroke="rgba(255,255,255,0.9)" stroke-width="1.2" stroke-linecap="round"/></svg>`;
    if(tipo === 'network') return `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="5" r="2" stroke="rgba(255,255,255,0.9)" stroke-width="1.2"/><path d="M12 7v6" stroke="rgba(255,255,255,0.9)" stroke-width="1.2"/><circle cx="6" cy="16" r="2" stroke="rgba(255,255,255,0.9)" stroke-width="1.2"/><circle cx="18" cy="16" r="2" stroke="rgba(255,255,255,0.9)" stroke-width="1.2"/><path d="M7.5 14l4.5-3 4.5 3" stroke="rgba(255,255,255,0.9)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    return '';
  }

  // render function
  function render(type = 'pc', filter = ''){
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

      // small stagger reveal
      setTimeout(()=> card.classList.add('visible'), 80 * idx);

      // CTA click
      card.querySelector('.btn').addEventListener('click', (e)=>{
        const name = e.currentTarget.dataset.name;
        const price = e.currentTarget.dataset.price;
        // ejemplo: enviar a cotizar (por ahora un alert)
        alert(`Servicio seleccionado:\n${name}\nPrecio base: $${Number(price).toFixed(2)}`);
      });
    });
  }

  // toggles behaviour
  toggles.forEach(btn => {
    btn.addEventListener('click', ()=> {
      toggles.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.type, search.value || '');
    });
  });

  // search behaviour (debounced)
  let debounce;
  search.addEventListener('input', e=>{
    clearTimeout(debounce);
    debounce = setTimeout(()=> {
      const activeType = document.querySelector('.toggle.active').dataset.type;
      render(activeType, e.target.value);
    }, 180);
  });

  // initial render
  render('pc');

  // IntersectionObserver for subtle parallax / glow (optional)
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting) en.target.style.transform = 'translateY(0)';
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.card').forEach(c => observer.observe(c));
});
