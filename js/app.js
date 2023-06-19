// CONSTRUCTORES

// Modelo del objeto final del seguro seleccionado

function Seguro(marca, year, tipo) {
  this.marca = marca;
  this.year = year;
  this.tipo = tipo;
}

// Realiza la cotizacion con los datos

Seguro.prototype.cotizarSeguro = function () {
  /*
        1 = Americano 1.15
        2 = Asiático 1.05
        3 = Europeo 1.35
    */

  let cantidad;
  const base = 2000;

  switch (this.marca) {
    case "1":
      cantidad = base * 1.15;
      break;

    case "2":
      cantidad = base * 1.05;
      break;

    case "3":
      cantidad = base * 1.35;
      break;

    default:
      break;
  }

  // Leer el año
  const diferencia = new Date().getFullYear() - this.year;

  // Cada año que la diferencia es mayor, el coste se reduce un 3%
  cantidad -= (diferencia * 3 * cantidad) / 100;

  /*
        Si el tipo es básico se multiplica por un 30% mas
        Si el tipo es completo se multiplica por un 50% mas
    */

  if (this.tipo === "basico") {
    cantidad += (cantidad * 30) / 100;
  } else if (this.tipo === "completo") {
    cantidad += (cantidad * 50) / 100;
  }

  return cantidad;
};

// ========================================

function UI() {}

// Llena las opciones de los años

UI.prototype.llenarOpciones = () => {
  const max = new Date().getFullYear();
  const min = max - 23;

  const yearSelect = document.querySelector("#year");

  for (let i = max; i > min; i--) {
    let option = document.createElement("option");
    option.value = i;
    option.textContent = i;

    yearSelect.appendChild(option);
  }
};

// Muestra alertas
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
  const div = document.createElement("DIV");

  if (tipo === "error") {
    div.classList.add("error");
  } else {
    div.classList.add("correcto");
  }

  div.classList.add("mensaje", "mt-10");
  div.textContent = mensaje;

  // Insertar en el HTML
  const formulario = document.querySelector("#cotizar-seguro");
  formulario.insertBefore(div, document.querySelector("#resultado"));

  setTimeout(() => {
    div.remove();
  }, 3500);
};

UI.prototype.mostrarResultado = (total, seguro) => {
  const { marca, year, tipo } = seguro;

  let textoMarca;

  switch (marca) {
    case "1":
      textoMarca = "Americano";
      break;
    case "2":
      textoMarca = "Asiático";
      break;
    case "3":
      textoMarca = "Europeo";
      break;

    default:
      break;
  }

  // Crear el resultado
  const div = document.createElement("DIV");
  div.classList.add("mt-10");

  div.innerHTML = `
        <p class='header'>Tu resumen</p>
        <p class='font-bold'>Marca: <span class='font-normal'>${textoMarca}</span> </p>
        <p class='font-bold'>Año: <span class='font-normal'>${year}</span> </p>
        <p class='font-bold'>Tipo de Cobertura: <span class='font-normal capitalize'>${tipo}</span> </p>
        <p class='font-bold'>Total: <span class='font-normal'>${total}€</span> </p>
    `;

  const resultadoDiv = document.querySelector("#resultado");

  // Mostrar el spinner
  const spinner = document.querySelector("#cargando");
  spinner.style.display = "block";

  setTimeout(() => {
    spinner.style.display = "none"; // Borramos spinner
    resultadoDiv.appendChild(div); // Se muestra resultado
  }, 3000);
};

// Instanciar UI

const ui = new UI();

document.addEventListener("DOMContentLoaded", () => {
  ui.llenarOpciones(); // Llenar el select de los años al cargar el dom
});

eventListeners();

function eventListeners() {
  const formulario = document.querySelector("#cotizar-seguro");
  formulario.addEventListener("submit", cotizarSeguro);
}

function cotizarSeguro(e) {
  e.preventDefault();

  // Leer la marca seleccionada
  const marca = document.querySelector("#marca").value;
  // Leer el año seleccionado
  const year = document.querySelector("#year").value;

  // Leer el tipo de cobertura seleccionada
  const tipo = document.querySelector('input[name="tipo"]:checked').value;

  if (marca === "" || year === "" || tipo === "") {
    ui.mostrarMensaje("Todos los campos son obligatorios", "error");
    return;
  }

  ui.mostrarMensaje("Cotizando...");

  // Ocultar cotizaciones previas
  const resultados = document.querySelector("#resultado div");

  if (resultados !== null) {
    resultados.remove();
  }

  // Instanciar el seguro

  const seguro = new Seguro(marca, year, tipo);
  const total = seguro.cotizarSeguro();

  // Utilizar el prototype que va a realizar la cotización
  ui.mostrarResultado(total, seguro);
}
