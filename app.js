const tablero = document.querySelector('.tablero'),
celdas = tablero.querySelectorAll('.celda'),
panel = document.querySelector('.mensaje-final'),
restartBtn = document.querySelector('.restart-btn'),
combinacionesGanadoras = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

celdas.forEach( celda => {
    celda.addEventListener('click' , (e) => {makeMove(e.target)})
})
restartBtn.addEventListener('click', (e) => {restart()})

const isFree = (celda) =>{
    if(celda.classList.contains('x') || celda.classList.contains('o')) return false
    return true
}

const makeMove = (celda) => {
    if(isFree(celda)){
        if(tablero.classList.contains('x')){
            celda.classList.add('x')
        }else{
            celda.classList.add('o')
        }
        switchTurns()
    }
    let winner = checkWin()
    if(winner !== false)won(winner);
    else if(isFinnished())draw()
}
const checkWin = () => {
    if(combinacionesGanadoras.some(combinacion => {
        return combinacion.every(element => {
            return celdas[element].classList.contains('x')
        })
    }))return 'X'
    if(combinacionesGanadoras.some(combinacion => {
        return combinacion.every(element => {
            return celdas[element].classList.contains('o')
        })
    }))return 'O'
    return false
}
const isFinnished = () => {
    let finnished = true
    celdas.forEach(celda => {
        if(isFree(celda))finnished = false
    })
    return finnished
}
const switchTurns = () => {
    tablero.classList.toggle('x')
    tablero.classList.toggle('o')
}
const won = (winner) => {
    mostrarMensajeFinal(`${winner} ha ganado !`)
}
const draw = () => {
    mostrarMensajeFinal('Es un empate!')
}
const restart = () => {
    limpiarTablero()
    reiniciarTurnos()
    panel.classList.remove('show')
}
const limpiarTablero = () => {
    celdas.forEach(celda=>{
        celda.classList.remove('x')
        celda.classList.remove('o')
    })
}
const reiniciarTurnos = () => {
    tablero.classList.remove('o')
    tablero.classList.add('x')
}
const mostrarMensajeFinal = (mensaje) => {
    panel.querySelector('h1').innerText = mensaje
    panel.classList.add('show')
}