document.addEventListener("DOMContentLoaded", cargarClientes);

const form = document.getElementById("formCliente");
const tabla = document.querySelector("#tablaClientes tbody");
const select = document.getElementById("selectClientes");
const msg = document.getElementById("msgCliente");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const telefono = document.getElementById("telefono").value;

  const cliente = { nombre, email, telefono };

  // Guardar SOLO en clientesDB
  let clientes = JSON.parse(localStorage.getItem("clientesDB")) || [];
  clientes.push(cliente);
  localStorage.setItem("clientesDB", JSON.stringify(clientes));

  msg.textContent = "Cliente registrado exitosamente!";
  form.reset();

  cargarClientes();
});

/* Cargar clientes en tabla y select */
function cargarClientes() {
  let clientes = JSON.parse(localStorage.getItem("clientesDB")) || [];

  tabla.innerHTML = "";
  select.innerHTML = "<option value='' disabled selected>Seleccione un cliente</option>";

  clientes.forEach(cli => {
    // TABLA
    let fila = `
      <tr>
        <td>${cli.nombre}</td>
        <td>${cli.email}</td>
        <td>${cli.telefono}</td>
      </tr>
    `;
    tabla.innerHTML += fila;

    // SELECT
    let opt = document.createElement("option");
    opt.value = cli.nombre;
    opt.textContent = cli.nombre;
    select.appendChild(opt);
  });
}
