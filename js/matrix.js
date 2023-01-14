// data-command, data-info, data-input

// Elementos del DOOM
const contenedorComandos = document.getElementById('contenedor-comandos')
let ultimoInput = ""


// Variables Globales
// const contenedorInputs = []
let contador = 0
let desencriptadas = ['a', 'e', 'i', 'o', 'u']
let encriptadas = ['ai', 'enter', 'imes', 'ober', 'ufat']
let tipoProceso = ""
let ultimaEncriptacion = ""
// Eventos
document.addEventListener('DOMContentLoaded', mostrarPantalla)
window.addEventListener('resize', VolverVersionNormal)


// Funciones
function crearInput(tipo, mensaje) {
  const div = document.createElement('div')
  const input = document.createElement('input')
  const span = document.createElement('span')

  // Clase segun el tipo de comando
  div.classList.add(tipo)

  input.type = "text"
  input.spellcheck = false

  // Asigar elemento segun el tipo linea de comando
  if (tipo === "command") {
    span.textContent = "> "
    input.spellcheck = false
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
  // contenedorInputs.push(input)

  contador++

}

// Al presionar Enter se ejecutara el comando
function ejecutarComando(e) {
  const keycode = e.keyCode;
  // Ejecuta con la tecla Enter keycode = 13
  if (keycode == '13') {
    const comandoFormateado = e.target.value.trim()
    const comandoId = e.target.id

    if (e.target.parentElement.classList.contains('command')) {
      // Lee el comando y entra a un switch comandos
      leerCommand(comandoFormateado, comandoId)
    } else if (e.target.parentElement.classList.contains('input')) {
      // Lee el comando y entra a un switch comandos inputs
      leerInput(comandoId)
    }
  }
}

// Al escribir en el input se ejecutar este comando
function ejecutarInput(e) {
  let comandoFormateado = e.target.value.trim()
  // const comandoId = e.target.id

  // Validar mayusculas y sin acentos y formateamos el texto con la función
  if (comandoFormateado !== "") {
    comandoFormateado = validacionMayusculasAcentos(comandoFormateado)
  }

  // Si esta hay texto mostramos la pantalla sec sino la ocultamos
  if (comandoFormateado === "") {
    pantallaSecundaria("ocultar")
  } else {
    pantallaSecundaria("mostrar")
  }

  // Encripta o desencripta en base al comando ejecutado
  if (tipoProceso === 'encriptar') {
    encriptando("[Encrypting...]", encriptar(comandoFormateado))
  } else if (tipoProceso === 'desencriptar') {
    desencriptando("[Decrypting...]", desencriptar(comandoFormateado))
    // ( ﾉ ﾟｰﾟ)ﾉ I
  }
}

// Lee el comando en caso de comando tipo command >
function leerCommand(comando, id) {
  let deshabilitar = true

  switch (comando) {
    case "help":
      commandHelp()
      break;
    case "clear":
      commandClear()
      deshabilitar = false
      break;
    case "return":
      commandReturn()
      break;
    case "encrypter":
      commandEncrypter()
      break;
    case "decrypter":
      commandDecrypter()
      break;
    case "copy":
      commandCopy()
      break;
    default:
      commandUnknown()
      break;
  }
  // Deshabilitamos el comando anterior después de la ejecución

  deshabilitar ? deshabilitarComandoAnterior(id, "keydown") : ""
}

// Leer el comando en caso de comando tipo input #
function leerInput(id) {
  
  commandInputEnter()
  // Deshabilitamos el comando anterior después de la ejecución
   deshabilitarComandoAnterior(id, "keydown")
}

function deshabilitarComandoAnterior(id, evento) {
  const elemento = document.getElementById(id)

  elemento.setAttribute('disabled', '')

  // Se encarga de dar focus a elemento y agregar el evento
  agregarEventoInput(evento)
}
// Comandos

function commandUnknown() {
  crearInput("info", "Unknown command try with the help command")
  crearInput("command")
}

function commandHelp() {
  crearInput("info", "help -> show all commands")
  crearInput("info", "encrypter -> open encrypter")
  crearInput("info", "decrypter -> open decrypter")
  crearInput("info", "clear -> clear console")
  crearInput("info", "copy -> copy last message encrypted/decrypted")
  crearInput("info", "return -> switch to the normal version")
  crearInput("command")
}

function commandClear() {
  while (contenedorComandos.length > 1) {
    contenedorComandos.removeChild(contenedorComandos.children[1])
  }
  // Como llamam la funcion deshabilitar no ejecuta la funcion agregarEventoInput
  crearInput("command")
  // Focus y agrega evento al input
  agregarEventoInput("keydown")
}

function commandReturn() {
  mensajeDespegable("[ I ]", "ヾ(￣▽￣) Bye~Bye~")
  window.location = "index.html"
}

function commandEncrypter() {
  crearInput("info", "Only lowercase and no accents!")
  crearInput("info", "encrypting...")
  crearInput("input")
  agregarEventoInput("input")
  tipoProceso = 'encriptar'
}

function commandDecrypter() {
  crearInput("info", "Only lowercase and no accents!")
  crearInput("info", "decrypting...")
  crearInput("input")
  agregarEventoInput("input")
  tipoProceso = 'desencriptar'
}

function commandCopy() {
  if(ultimaEncriptacion === "") {
    crearInput("info","Has not yet encrypted anything")
    crearInput("command")
  } else {
    copiar()
    crearInput("info","Successfully copied!")
    crearInput("command")
  }
}

// Command Input
function commandInputEnter() {
  crearInput('command')
  pantallaSecundaria("ocultar")
}


// Otras Funciones

// Copiar ultimo mensaje encryptado/desencriptado
function copiar() {
  navigator.clipboard.writeText(ultimaEncriptacion).then(() => {
    // Copiado correctamente
  }, () => {
    // A surgido un error
    mensajeDespegable("[INFO]", "Copy error!")
  });
}

// Mostramos el texto encriptado o desencriptado en pantalla segun siga escribiendo
function encriptando(titulo, texto) {
  const tituloSecundaria = document.getElementById('titulo-secundaria')
  const outputTexto = document.getElementById('output-texto')

  tituloSecundaria.textContent = titulo
  outputTexto.textContent = texto

  ultimaEncriptacion = texto
}

function desencriptando(titulo, texto) {
  const tituloSecundaria = document.getElementById('titulo-secundaria')
  const outputTexto = document.getElementById('output-texto')

  tituloSecundaria.textContent = titulo
  outputTexto.textContent = texto

  ultimaEncriptacion = texto
}

// Retorna el texto encriptado
function encriptar(texto) {
  let textoModificado = ""

  for (let i = 0; i < texto.length; i++) {
    let v = false // Vandera para saber si se ha encriptado o no el caracter
    for (let j = 0; j < 5; j++) {
      if (texto[i] == desencriptadas[j]) {
        textoModificado += encriptadas[j]
        v = true
      }

      // Si el caracter no se ha encriptado pasamos el mismo caracter
      if (!v && j == 4) {
        textoModificado += texto[i]
      }
    }
  }
  return textoModificado;
}

// Retorna el texto desencriptado
function desencriptar(texto) {
  let textoModificado = ''
  let contador = 0 // Indice para pasar letras no encriptadas al textoModificado

  for (let i = 0; i < texto.length; i++) {
    let v = false // Es una vandera para saber si se a encriptado o si hay que pasar la misma letra
    let subtexto = '' // Tomamos solo una parte del texto que concuerde con los caracteres de encriptados ejm: ai entonces tomamos 2 caracteres del texto y lo comparamos

    for (let j = 0; j < 5; j++) {
      let encriptadaLongitud = (encriptadas[j].length) + i // Indice max del subtexto
      // console.log(i,"-",encriptadaLongitud)
      subtexto = texto.substring(i, encriptadaLongitud)
      // console.log(subtexto, '-', encriptadas[j])
      // Comparamos los caracteres de encriptadas con los de subtexto ambos de la misma longitud
      if (subtexto == encriptadas[j]) {
        textoModificado += desencriptadas[j] // Pasamos los textos desencriptados al una nueva variable
        v = true // Desencriptado vandera true
        i += encriptadas[j].length - 1 // Con este incremento evitamos recorrer de nuevo los caracteres desencriptados
        contador += encriptadas[j].length - 1 // Contador para solo recorrer los caracteres que no fueron desencriptados
      }

      // Si el caracter no se a desencriptado pasamos el mismo caracter a la nueva variable textoModificado
      if (!v && j == 4) {
        // Evitamos que pase caracteres fuera del rango
        if (contador < texto.length) {
          textoModificado += texto[contador] // Pasamos el caracter que no se ha desencriptado a la nueva variable
        }
      }
    }
    contador++ // contador caracteres no desencriptados
  }
  return textoModificado;
}

// Validar mayusculas y acentos
function validacionMayusculasAcentos(texto) {
  const reNombres = /^[a-z\s]+$/i
  const validacion = texto.match(reNombres)
  const textoConvertido = removerAcentos(texto.toLowerCase())

  if (validacion === null || textoConvertido !== texto) {
    mensajeDespegable("[WARNING]", "'ONLY LOWERCASE AND NO ACCENTS!'")
  }

  return textoConvertido
}

function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function mensajeDespegable(titulo, mensaje) {
  const div = document.createElement('div')
  const div2 = document.createElement('div')
  const h2 = document.createElement('h2')
  const div3 = document.createElement('div')
  const p = document.createElement('p')

  div.classList.add('contenedor-mensaje')
  div.id = "contenedor-mensaje"

  div2.classList.add('contenedor-titulo-mensaje')
  h2.classList.add('titulo-mensaje')
  h2.id = 'titulo-mensaje'
  h2.textContent = titulo

  div3.classList.add('contenedor-texto-mensaje')
  p.classList.add('texto-mensaje')
  p.textContent = mensaje

  div3.appendChild(p)
  div2.appendChild(h2)
  div.appendChild(div2)
  div.appendChild(div3)

  document.querySelector('main').appendChild(div)

  setTimeout(() => {
    div.remove()
  }, 2000);
}

function pantallaSecundaria(accion) {
  const pantallaSecundaria = document.getElementById('pantalla-secundaria')

  if (accion === "mostrar") {
    pantallaSecundaria.classList.remove('ocultar')
  } else {
    pantallaSecundaria.classList.add('ocultar')
  }
}

// Mostramos la pantalla principal una vez termine la animación del fondo
function mostrarPantalla() {
  const pantallaPrincipal = document.getElementById('pantalla-principal')

  // Versión personalizada no es posible usarla en celualar
  VolverVersionNormal()

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

  agregarEventoInput("keydown")
}

// Agregamos evento al input segun corresponda
function agregarEventoInput(evento) {
  // Declaramos la variable ultimoInput
  ultimoInput = contenedorComandos.lastElementChild
  // Focus al elemento input
  ultimoInput.children[1].focus()
  // Agregamos el evento keydown al input
  if (evento === "keydown") {
    ultimoInput.addEventListener(evento, ejecutarComando)
  } else if (evento === "input") {
    ultimoInput.addEventListener(evento, ejecutarInput)
  }
}

// La versión personalizada no es posible usarla en celular
function VolverVersionNormal() {
  if (window.innerWidth <= 1100) {
    window.location = "index.html"
  }

}