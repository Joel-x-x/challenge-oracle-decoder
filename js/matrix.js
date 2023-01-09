// data-command, data-info, data-input

// Elementos del DOOM
const contenedorComandos = document.getElementById('contenedor-comandos')
let ultimoInput = ""


// Variables Globales
const contenedorInputs = []
let contador = 0

// Eventos
document.addEventListener('DOMContentLoaded', mostrarPantalla)




// Funciones
function crearInput(tipo, mensaje) {
  const div = document.createElement('div')
  const input = document.createElement('input')
  const span = document.createElement('span')

  // Clase segun el tipo de comando
  div.classList.add(tipo)

  input.type = "text"

  // Asigar elemento segun el tipo linea de comando
  if (tipo === "command") {
    span.textContent = "> "
  } else if (tipo === "info") {
    span.textContent = ""
    input.setAttribute("disabled", "")
    input.value = mensaje
  } else if (tipo === "input") {
    span.textContent = "# "
  }

  // Asignar id
  input.id = contador

  // Agregar elemtos a sus componentes
  div.appendChild(span)
  div.appendChild(input)
  contenedorComandos.appendChild(div)

  // Ingresar elemnto al array
  contenedorInputs.push(input)

  contador++

}

// Al presionar Enter se ejecutara el comando
function ejecutarComando(e) {
  const keycode = e.keyCode;
  // Ejecuta con la tecla Enter keycode = 13
  if (keycode == '13') {
    const comandoFormateado = e.target.value.trim()
    const comandoId = e.target.id

    // Lee el comando y llama a la funcion correspondiente
    leerComando(comandoFormateado, comandoId)
    // Crear comando clear y agregar scroll al contenedor comandos
  }
}


function leerComando(comando, id) {
  switch (comando) {
    case "help":
      commandHelp()
      break;
    case "":

      break;
    case "":

      break;
    case "":

      break;
    case "":

      break;
    case "":

      break;
    case "":

      break;

    default:
      commandUnknown()
      break;
  }
  // Deshabilitamos el comando anterior después de la ejecución
  deshabilitarComandoAnterior(id)
}

function deshabilitarComandoAnterior(id) {
  const elemento = document.getElementById(id)

  elemento.setAttribute('disabled', '')

  // Se encarga de dar focus a elemento y agregar el evento
  eventoInput()
}
// Comandos

function commandUnknown() {
  crearInput("info", "Unknown command try with the help command")
  crearInput("command")
}

function commandHelp() {
  crearInput("info", "encoder -> open encoder")
  crearInput("info", "decoder -> open decoder")
  crearInput("info", "clear -> clear console")
  crearInput("info", "copy -> copy message")
  crearInput("info", "exit -> exit to the command")
  crearInput("info", "return -> switch to the normal version")
  crearInput("info", "help -> show all commands")
  crearInput("command")
}


// Otras Funciones

// Mostramos la pantalla principal una vez termine la animación del fondo
function mostrarPantalla() {
  const pantallaPrincipal = document.getElementById('pantalla-principal')


  pantallaPrincipal.style.setProperty("visibility", "hidden")


  setTimeout(() => {
    pantallaPrincipal.style.removeProperty('visibility')

    pantallaVisible()
  }, 2500)

}

// Una ves este visible la pantalla principal ejecutamos algunos comandos
function pantallaVisible() {
  // Insertamos la primera linea de comandos
  crearInput("command")

  eventoInput()
}

function eventoInput() {
  // Declaramos la variable ultimoInput
  ultimoInput = contenedorComandos.lastElementChild

  // Focus al elemento input
  ultimoInput.children[1].focus()
  // Agregamos el evento keydown al input
  ultimoInput.addEventListener('keydown', ejecutarComando)
}