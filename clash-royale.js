// === VARIABLES GLOBALES ===
let ataqueJugador = []
let ataqueEnemigo = []
let vidasJugador = 3
let vidasEnemigo = 3
let magos = []
let magoJugador = null
let magoJugadorObjeto = null // CORREGIDO: Variable consistente
let ataquesMagoEnemigo = []
let botonFuego
let botonHielo
let botonElectricidad
let botones = []
let indexAtaqueJugador
let indexAtaqueEnemigo
let victoriasJugador = 0
let victoriasEnemigo = 0
let lienzo = null
let intervalo = null
let mapaBackground = new Image()
mapaBackground.src = './assets/arena-clash.jpg'
let alturaQueBuscamos
let anchoDelMapa = window.innerWidth - 20
const anchoMaximoDelMapa = 350

if (anchoDelMapa > anchoMaximoDelMapa) {
    anchoDelMapa = anchoMaximoDelMapa - 20
}

alturaQueBuscamos = anchoDelMapa * 600 / 800
let magosEnemigos = []

// === CLASES ===
class Mago {
    constructor(nombre, foto, vida, fotoMapa, especialidad) {
        this.nombre = nombre
        this.foto = foto
        this.vida = vida
        this.especialidad = especialidad
        this.ataques = []
        this.ancho = 40
        this.alto = 40
        this.x = aleatorio(0, anchoDelMapa - this.ancho)
        this.y = aleatorio(0, alturaQueBuscamos - this.alto)
        this.mapaFoto = new Image()
        this.mapaFoto.src = fotoMapa
        this.velocidadX = 0
        this.velocidadY = 0
    }

    pintarMago() {
        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto
        )
    }
}

class Hechizo {
    constructor(nombre, id, emoji) {
        this.nombre = nombre
        this.id = id
        this.emoji = emoji
    }
}

// === CREACIÓN DE MAGOS ===
let magoFuego = new Mago('Mago de Fuego', './assets/mago de fuego.jpg', 5, './assets/carta de mago de fuego.jpg', 'Fuego')
let magoHielo = new Mago('Mago de Hielo', './assets/mago de hielo.jpg', 5, './assets/carta de mago de hielo.jpg', 'Hielo')
let magoElectrico = new Mago('Mago Eléctrico', './assets/mago electrico.jpg', 5, './assets/carta de mago electrico.jpg', 'Electricidad')

// === CREACIÓN DE HECHIZOS ===
let hechizoFuego1 = new Hechizo('Bola de Fuego', 'boton-fuego', '🔥')
let hechizoFuego2 = new Hechizo('Llamarada', 'boton-fuego', '🔥')
let hechizoFuego3 = new Hechizo('Incineración', 'boton-fuego', '🔥')

let hechizoHielo1 = new Hechizo('Tormenta de Hielo', 'boton-hielo', '❄️')
let hechizoHielo2 = new Hechizo('Rayo Congelante', 'boton-hielo', '❄️')
let hechizoHielo3 = new Hechizo('Ventisca', 'boton-hielo', '❄️')

let hechizoElectricidad1 = new Hechizo('Rayo', 'boton-electricidad', '⚡')
let hechizoElectricidad2 = new Hechizo('Tormenta Eléctrica', 'boton-electricidad', '⚡')
let hechizoElectricidad3 = new Hechizo('Descarga', 'boton-electricidad', '⚡')

// === ASIGNACIÓN DE HECHIZOS A MAGOS ===
magoFuego.ataques.push(hechizoFuego1, hechizoFuego2, hechizoFuego3, hechizoElectricidad1, hechizoHielo1)
magoHielo.ataques.push(hechizoHielo1, hechizoHielo2, hechizoHielo3, hechizoFuego1, hechizoElectricidad1)
magoElectrico.ataques.push(hechizoElectricidad1, hechizoElectricidad2, hechizoElectricidad3, hechizoHielo1, hechizoFuego1)

magos.push(magoFuego, magoHielo, magoElectrico)

// === FUNCIONES DE INICIO ===
function iniciarJuego() {
    let sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque')
    sectionSeleccionarAtaque.style.display = 'none'
    
    let sectionVerMapa = document.getElementById('ver-mapa')
    sectionVerMapa.style.display = 'none'

    magos.forEach((mago) => {
        let opcionDeMagos = `
        <input type="radio" name="mascota" id="${mago.nombre}" />
        <label class="tarjeta-de-mokepon" for="${mago.nombre}">
            <p>${mago.nombre}</p>
            <img src="${mago.foto}" alt="${mago.nombre}">
            <small>${mago.especialidad}</small>
        </label>
        `
        let contenedorTarjetas = document.getElementById('contenedorTarjetas')
        contenedorTarjetas.innerHTML += opcionDeMagos
    })
    
    let botonMascotaJugador = document.getElementById('boton-mascota')
    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador)

    let botonReiniciar = document.getElementById('boton-reiniciar')
    botonReiniciar.addEventListener('click', reiniciarJuego)
}

function seleccionarMascotaJugador() {
    let sectionSeleccionarMascota = document.getElementById('seleccionar-mascota')
    sectionSeleccionarMascota.style.display = 'none'
    
    let inputMagoFuego = document.getElementById('Mago de Fuego')
    let inputMagoHielo = document.getElementById('Mago de Hielo')
    let inputMagoElectrico = document.getElementById('Mago Eléctrico')
    let spanMascotaJugador = document.getElementById('mascota-jugador')
    
    if (inputMagoFuego.checked) {
        spanMascotaJugador.innerHTML = inputMagoFuego.id
        magoJugador = inputMagoFuego.id
    } else if (inputMagoHielo.checked) {
        spanMascotaJugador.innerHTML = inputMagoHielo.id
        magoJugador = inputMagoHielo.id
    } else if (inputMagoElectrico.checked) {
        spanMascotaJugador.innerHTML = inputMagoElectrico.id
        magoJugador = inputMagoElectrico.id
    } else {
        alert('⚠️ Selecciona un mago para continuar')
        reiniciarJuego()
        return
    }

    extraerAtaques(magoJugador)
    iniciarMapa()
}

function extraerAtaques(mascotaJugador) {
    let ataques = []
    for (let i = 0; i < magos.length; i++) {
        if (mascotaJugador === magos[i].nombre) {
            ataques = magos[i].ataques
            break
        }
    }
    mostrarAtaques(ataques)
}

function mostrarAtaques(ataques) {
    let contenedorAtaques = document.getElementById('contenedorAtaques')
    contenedorAtaques.innerHTML = ''
    
    ataques.forEach((ataque) => {
        let claseBoton = ''
        if (ataque.id === 'boton-fuego') {
            claseBoton = 'boton-fuego'
        } else if (ataque.id === 'boton-hielo') {
            claseBoton = 'boton-hielo'
        } else if (ataque.id === 'boton-electricidad') {
            claseBoton = 'boton-electricidad'
        }
        
        let ataquesMago = `
        <button id="${ataque.id}" class="boton-de-ataque ${claseBoton} BAtaque" data-tipo="${ataque.nombre}">
            ${ataque.emoji} ${ataque.nombre}
        </button>
        `
        contenedorAtaques.innerHTML += ataquesMago
    })

    botonFuego = document.getElementById('boton-fuego')
    botonHielo = document.getElementById('boton-hielo')
    botonElectricidad = document.getElementById('boton-electricidad')
    botones = document.querySelectorAll('.BAtaque')
    
    secuenciaAtaque()
}

function secuenciaAtaque() {
    botones.forEach((boton) => {
        boton.addEventListener('click', (e) => {
            let tipoAtaque = ''
            if (e.target.id === 'boton-fuego') {
                ataqueJugador.push('FUEGO')
                tipoAtaque = 'FUEGO'
            } else if (e.target.id === 'boton-hielo') {
                ataqueJugador.push('HIELO')
                tipoAtaque = 'HIELO'
            } else if (e.target.id === 'boton-electricidad') {
                ataqueJugador.push('ELECTRICIDAD')
                tipoAtaque = 'ELECTRICIDAD'
            }
            
            console.log('Ataque del jugador:', tipoAtaque)
            boton.style.background = 'linear-gradient(145deg, #2C3E50, #34495E)'
            boton.disabled = true
            
            if (ataqueJugador.length === 5) {
                enviarAtaques()
            }
        })
    })
}

function enviarAtaques() {
    // Simular ataques del enemigo para modo offline
    for (let i = 0; i < 5; i++) {
        ataqueAleatorioEnemigo()
    }
    combate()
}

function seleccionarMascotaEnemigo(enemigo) {
    let spanMascotaEnemigo = document.getElementById('mascota-enemigo')
    spanMascotaEnemigo.innerHTML = enemigo.nombre
    ataquesMagoEnemigo = enemigo.ataques
}

function ataqueAleatorioEnemigo() {
    let ataqueAleatorio = aleatorio(0, 2)
    
    if (ataqueAleatorio === 0) {
        ataqueEnemigo.push('FUEGO')
    } else if (ataqueAleatorio === 1) {
        ataqueEnemigo.push('HIELO')
    } else {
        ataqueEnemigo.push('ELECTRICIDAD')
    }
}

function combate() {
    let spanVidasJugador = document.getElementById('vidas-jugador')
    let spanVidasEnemigo = document.getElementById('vidas-enemigo')
    
    for (let index = 0; index < ataqueJugador.length; index++) {
        if (ataqueJugador[index] === ataqueEnemigo[index]) {
            indexAmbosOponente(index, index)
            crearMensaje("🤝 EMPATE")
        } else if (
            (ataqueJugador[index] === 'FUEGO' && ataqueEnemigo[index] === 'HIELO') ||
            (ataqueJugador[index] === 'HIELO' && ataqueEnemigo[index] === 'ELECTRICIDAD') ||
            (ataqueJugador[index] === 'ELECTRICIDAD' && ataqueEnemigo[index] === 'FUEGO')
        ) {
            indexAmbosOponente(index, index)
            crearMensaje("🎉 GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        } else {
            indexAmbosOponente(index, index)
            crearMensaje("💀 PERDISTE")
            victoriasEnemigo++
            spanVidasEnemigo.innerHTML = victoriasEnemigo
        }
    }

    revisarVidas()
}

function indexAmbosOponente(jugador, enemigo) {
    indexAtaqueJugador = jugador
    indexAtaqueEnemigo = enemigo
}

function revisarVidas() {
    if (victoriasJugador === victoriasEnemigo) {
        crearMensajeFinal("⚔️ ¡Esto fue un empate épico! ⚔️")
    } else if (victoriasJugador > victoriasEnemigo) {
        crearMensajeFinal("🏆 ¡FELICITACIONES! ¡ERES EL MAESTRO MAGO! 🏆")
    } else {
        crearMensajeFinal("💀 El enemigo ha demostrado ser más poderoso 💀")
    }
}

function crearMensaje(resultado) {
    let sectionMensajes = document.getElementById('resultado')
    let ataquesDelJugador = document.getElementById('ataques-del-jugador')
    let ataquesDelEnemigo = document.getElementById('ataques-del-enemigo')

    let nuevoAtaqueDelJugador = document.createElement('p')
    let nuevoAtaqueDelEnemigo = document.createElement('p')

    sectionMensajes.innerHTML = resultado

    // Mostrar el emoji del ataque
    if (ataqueJugador[indexAtaqueJugador] === 'FUEGO') {
        nuevoAtaqueDelJugador.innerHTML = '🔥'
    } else if (ataqueJugador[indexAtaqueJugador] === 'HIELO') {
        nuevoAtaqueDelJugador.innerHTML = '❄️'
    } else {
        nuevoAtaqueDelJugador.innerHTML = '⚡'
    }

    if (ataqueEnemigo[indexAtaqueEnemigo] === 'FUEGO') {
        nuevoAtaqueDelEnemigo.innerHTML = '🔥'
    } else if (ataqueEnemigo[indexAtaqueEnemigo] === 'HIELO') {
        nuevoAtaqueDelEnemigo.innerHTML = '❄️'
    } else {
        nuevoAtaqueDelEnemigo.innerHTML = '⚡'
    }

    ataquesDelJugador.appendChild(nuevoAtaqueDelJugador)
    ataquesDelEnemigo.appendChild(nuevoAtaqueDelEnemigo)
}

function crearMensajeFinal(resultadoFinal) {
    let sectionMensajes = document.getElementById('resultado')
    sectionMensajes.innerHTML = resultadoFinal

    botones.forEach((boton) => {
        boton.disabled = true
    })
}

function reiniciarJuego() {
    location.reload()
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function pintarCanvas() {
    if (magoJugadorObjeto) {
        magoJugadorObjeto.x = magoJugadorObjeto.x + magoJugadorObjeto.velocidadX
        magoJugadorObjeto.y = magoJugadorObjeto.y + magoJugadorObjeto.velocidadY
    }
    
    lienzo.clearRect(0, 0, anchoDelMapa, alturaQueBuscamos)
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        anchoDelMapa,
        alturaQueBuscamos
    )
    
    if (magoJugadorObjeto) {
        magoJugadorObjeto.pintarMago()
    }

    magosEnemigos.forEach(function (mago) {
        if (mago) {
            mago.pintarMago()
            revisarColision(mago)
        }
    })
}

function moverDerecha() {
    if (magoJugadorObjeto) {
        magoJugadorObjeto.velocidadX = 5
    }
}

function moverIzquierda() {
    if (magoJugadorObjeto) {
        magoJugadorObjeto.velocidadX = -5
    }
}

function moverAbajo() {
    if (magoJugadorObjeto) {
        magoJugadorObjeto.velocidadY = 5
    }
}

function moverArriba() {
    if (magoJugadorObjeto) {
        magoJugadorObjeto.velocidadY = -5
    }
}

function detenerMovimiento() {
    if (magoJugadorObjeto) {
        magoJugadorObjeto.velocidadX = 0
        magoJugadorObjeto.velocidadY = 0
    }
}

function sePresionoUnaTecla(event) {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            moverArriba()
            break
        case 'ArrowDown':
        case 's':
        case 'S':
            moverAbajo()
            break
        case 'ArrowLeft':
        case 'a':
        case 'A':
            moverIzquierda()
            break
        case 'ArrowRight':
        case 'd':
        case 'D':
            moverDerecha()
            break
        default:
            break
    }
}

function iniciarMapa() {
    let sectionVerMapa = document.getElementById('ver-mapa')
    sectionVerMapa.style.display = 'flex'
    let mapa = document.getElementById('mapa')
    mapa.width = anchoDelMapa
    mapa.height = alturaQueBuscamos
    lienzo = mapa.getContext('2d')

    // CORREGIDO: Encontrar el mago seleccionado
    for (let i = 0; i < magos.length; i++) {
        if (magoJugador === magos[i].nombre) {
            magoJugadorObjeto = magos[i] // Variable correcta
            break
        }
    }

    // Crear magos enemigos
    crearMagosEnemigos()
    
    // Iniciar el loop de pintado
    intervalo = setInterval(pintarCanvas, 50)

    window.addEventListener('keydown', sePresionoUnaTecla)
    window.addEventListener('keyup', detenerMovimiento)
}

function crearMagosEnemigos() {
    // CORREGIDO: Crear 2-3 magos enemigos aleatorios
    let numeroEnemigos = aleatorio(2, 4)
    magosEnemigos = []
    
    for (let i = 0; i < numeroEnemigos; i++) {
        let magoAleatorio = aleatorio(0, magos.length - 1) // CORREGIDO: índice correcto
        let magoEnemigo = new Mago(
            magos[magoAleatorio].nombre,
            magos[magoAleatorio].foto,
            magos[magoAleatorio].vida,
            magos[magoAleatorio].mapaFoto.src,
            magos[magoAleatorio].especialidad
        )
        magoEnemigo.ataques = [...magos[magoAleatorio].ataques]
        magosEnemigos.push(magoEnemigo)
    }
    
    console.log('Enemigos creados:', magosEnemigos.length) // Para debug
}

function revisarColision(enemigo) {
    if (!magoJugadorObjeto || !enemigo) return

    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x

    const arribaMascota = magoJugadorObjeto.y
    const abajoMascota = magoJugadorObjeto.y + magoJugadorObjeto.alto
    const derechaMascota = magoJugadorObjeto.x + magoJugadorObjeto.ancho
    const izquierdaMascota = magoJugadorObjeto.x

    if (
        abajoMascota < arribaEnemigo ||
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo
    ) {
        return
    }

    detenerMovimiento()
    clearInterval(intervalo)
    console.log('Batalla iniciada!')
    
    let sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque')
    sectionSeleccionarAtaque.style.display = 'flex'
    let sectionVerMapa = document.getElementById('ver-mapa')
    sectionVerMapa.style.display = 'none'
    
    seleccionarMascotaEnemigo(enemigo)
}

// === INICIO DEL JUEGO ===
window.addEventListener('load', iniciarJuego)