// Elementos del DOM
const textareaIngreso = document.getElementById('textarea-ingreso')
const textareaSalida = document.getElementById('textarea-salida')
const botonEncriptar = document.getElementById('boton-encriptar')
const botonDesencriptar = document.getElementById('boton-desencriptar')
const botonCopiar = document.getElementById('boton-copiar')
const illustracion = document.getElementById('contenedor-illustracion')
const mensaje = document.getElementById('contenedor-mensaje')
const seccionDerecha = document.querySelector('.seccion-derecha')

// Variables
let desencriptadas = ['a', 'e', 'i', 'o', 'u']
let encriptadas = ['ai', 'enter', 'imes', 'ober', 'ufat']

// Eventos
botonEncriptar.addEventListener('click', accion)
botonDesencriptar.addEventListener('click', accion)

botonCopiar.addEventListener('click', copiar)

// Para que evite ajustar el texto en caso de que sea horizontal y no vertical el textarea salida
window.addEventListener('resize', ajustarTextarea)



// Funciones
function accion(e) {
  const texto = textareaIngreso.value.trim()
  // Aplicar trim() al textarea ingreso
  textareaIngreso.value = texto
  let textoModificado

  validacionMayusculasAcentos(texto)


  // Identificamos el boton encriptar o desencriptar
  if (e.target.classList.contains('boton-encriptar')) {
    textoModificado = encriptar(texto)
  } else {
    textoModificado = desencriptar(texto)
  }

  // Agregamos el texto al textarea salida
  textareaSalida.textContent = textoModificado

  textareaIngreso.focus()

  ocultarSalida()
  ajustarTextarea()
}

// Validar mayusculas y acentos
function validacionMayusculasAcentos(texto) {
  const reNombres = /^[a-z\s]+$/i
  const validacion = texto.match(reNombres)
  const textoConvertido = texto.toLowerCase()

  if (validacion === null || textoConvertido !== texto) {
    const alertaTexto = document.querySelector('.alerta-texto')
    alertaTexto.classList.add('alerta-validacion')
  
    setTimeout(() => {
      alertaTexto.classList.remove('alerta-validacion')
    }, 3000);
  }
}

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

// Oculta o muestra los elementos illustracion y mensaje
function ocultarSalida() {
  // Mostrar u ocultar elementos si hay o no contenido en textareaSalida
  if (textareaSalida.textContent == "") {
    if (illustracion.classList.contains('ocultar')) {
      illustracion.classList.remove('ocultar')
      mensaje.classList.remove('ocultar')
    }
    botonCopiar.classList.add('ocultar')
  } else {
    illustracion.classList.add('ocultar')
    mensaje.classList.add('ocultar')
    botonCopiar.classList.remove('ocultar')
  }
}

function copiar() {
  navigator.clipboard.writeText(textareaSalida.value).then(() => {
    // Copiado correctamente
    mensajeCopiado("¡Mensaje Copiado!")
  }, () => {
    // A surgido un error
    alert('A surgido un error al intentar copiar')
  });
}

// Ajustar el tamaño del textarea salida de acuerdo al texto
function ajustarTextarea() {
  if (window.innerWidth <= 1100) {
    textareaSalida.style.setProperty("height", textareaSalida.scrollHeight + "px")
  } else {
    textareaSalida.style.removeProperty("height")
  }
}

// Mensaje copiado
function mensajeCopiado(mensaje) {
  const div = document.createElement('div')
  const parrafo = document.createElement('p')

  // El elemento ya existe no creamos otro
  if (document.querySelector('.seccion-derecha').lastElementChild.classList.contains('contenedor-mensaje-copiado')) {
    return
  }

  div.classList.add('contenedor-mensaje-copiado')
  parrafo.classList.add('mensaje-copiado')

  parrafo.textContent = mensaje
  div.appendChild(parrafo)

  seccionDerecha.appendChild(div)

  setTimeout(() => {
    div.remove()
  }, 2000);


}
