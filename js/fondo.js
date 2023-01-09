// Código tomado de: https://codepen.io/0utKast/pen/GpzobR
//Fuente Original :  http://timelessname.com/sandbox/matrix.html
//Configura el canvas para que ocupe la pantalla entera 
canvas.height = window.innerHeight -1;
canvas.width = window.innerWidth;

// Se vuelve a dimensionar si la pantalla cambia de tamaño
window.addEventListener('resize', () => {
  canvas.height = window.innerHeight -1;
  canvas.width = window.innerWidth;
})

// una entrada en el array por columna de texto
//cada valor represnta la posición y actual de la columna.  (en canvas 0 es en la parte superior y los valores positivos de y van disminuyendo)
var columns = []
for (i = 0; i < 256; columns[i++] = 1);

//ejecutado una vez por fotograma
function step() {
    //Ligeramente oscurece todo el canvas dibujando un rectángulo negro casi trasnsparente sobre todo el canvas
    /*esto explica tanto el flash inicial de blanco a negro (por defecto el canvas es blanco y progresivamente se convierte en negro) como el fading de los caracteres.*/
    canvas.getContext('2d').fillStyle = 'rgba(0,0,0,0.05)';
    canvas.getContext('2d').fillRect(0, 0, canvas.width, canvas.height);
    
    //verde
    canvas.getContext('2d').fillStyle = '#3DE2B8';
    //para cada clolumna
    columns.map(function (value, index) {
        //fromCharCode convierte puntos de código unicode ( http://en.wikipedia.org/wiki/Code_point ) a un string
        //Los code points están en el rango 30000-30032 (0x7530-0x7550) (田-畐)
        //que está incluido en el bloque de ideogramas unificado CJK ( http://en.wikipedia.org/wiki/CJK_Unified_Ideographs )
        var character = String.fromCharCode(3e4 +
                                            Math.random() * 33);
        //dibujar el carácter
        canvas.getContext('2d').fillText(character, //texto
                                         index * 10, //x
                                         value //y
                                        );
        
        //desplaza hacia abajo el carácter
        //si el carácter es menor de 758 entonces hay una posibilidad aleatoria de que sea reseteado
        columns[index] = value > 758 + Math.random() * 1e4 ? 0 : value + 10
    })
}

//1000/33 = ~30 veces por segundo
setInterval(step, 33)