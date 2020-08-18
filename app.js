const board = document.querySelector('.board'),
cells = board.querySelectorAll('.cell'),
modeOptions = document.querySelectorAll('.option'),
botMenu = document.querySelector('#choose-mark'),
finalMessage = document.querySelector('.final-message'),
winningCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]
let isHumanVsBot = true,
matchStarted = false,
botMark = 'o'

cells.forEach( cell => { cell.addEventListener('click' , (e) => {makeMove(e.target)})})
modeOptions.forEach( option => {option.addEventListener('click', (e) => {changeGameMode(e)})})
botMenu.addEventListener('click', (e) => {handleBotMenu(e)})
finalMessage.addEventListener('click', (e) => {restart(e)})

const makeMove = (cell) => {
    if(cell!== false && isFree(cell)){
        if(board.classList.contains('x')){
            cell.classList.add('x')
        }else{
            cell.classList.add('o')
        }
        matchStarted = true
        switchTurns()
    }
    let winner = checkWin()
    if(winner !== false){won(winner);}
    else if(isFinnished())draw()
    if(!isFinnished())botMove()
}
const isBotsTurn = () => {
    if(isHumanVsBot && board.classList.contains(botMark))return true
    return false
}
const botMove = () => {
    if(isHumanVsBot && isBotsTurn()){
        makeMove(minimax(true))
    }
}
const minimax = (maximizer) => {
    let chosenCell = false
    cells.forEach(cell => {
        if(isFree(cell))chosenCell = cell
    })
    return chosenCell
}
const handleBotMenu = (event) => {
    let clicked = event.target 
    if(clicked.classList.contains('bot-start-btn'))newBotGame(clicked)
    else botMenu.classList.remove('show')
}
const isFree = (cell) =>{
    if(cell.classList.contains('x') || cell.classList.contains('o')) return false
    return true
}
const changeGameMode = (event) => {
    const selectedOption = event.target.parentElement
    if(selectedOption.classList.contains('local-2P'))showFinalMessage('¿Comenzar nueva Partida?')
    if(selectedOption.classList.contains('local-bot'))botMenu.classList.add('show');
}
const newBotGame = (playerMark) => {
    botMark = playerMark.classList.contains('x')? 'o' : 'x'
    matchStarted = true
    isHumanVsBot = true
    cleanBoard()
    resetTurns()
    botMove()
    showSelectedMode('.local-bot')
    botMenu.classList.remove('show')
}
const checkWin = () => {
    if(winningCombinations.some(combinacion => {
        return combinacion.every(element => {
            return cells[element].classList.contains('x')
        })
    }))return 'X'
    if(winningCombinations.some(combinacion => {
        return combinacion.every(element => {
            return cells[element].classList.contains('o')
        })
    }))return 'O'
    return false
}
const isFinnished = () => {
    if(checkWin() !== false)return true
    let finnished = true
    cells.forEach(cell => {
        if(isFree(cell))finnished = false
    })
    return finnished
}
const switchTurns = () => {
    board.classList.toggle('x')
    board.classList.toggle('o')
}
const won = (winner) => {
    showFinalMessage(`${winner} ha ganado !`)
}
const draw = () => {
    showFinalMessage('Es un empate!')
}
const restart = (e) => {
    if(e.target.classList.contains('restart-btn')){
        cleanBoard()
        resetTurns()
        isHumanVsBot = false
        matchStarted = false
       showSelectedMode('.local-2P')
        finalMessage.classList.remove('show')
    }
    if(!isFinnished())finalMessage.classList.remove('show')
}
const showSelectedMode = (mode) => {
    modeOptions.forEach(option => {
        option.querySelector('.indicator').classList.remove('selected')
    })
    document.querySelector(mode).querySelector('.indicator').classList.add('selected')
}
const cleanBoard = () => {
    cells.forEach(cell=>{
        cell.classList.remove('x')
        cell.classList.remove('o')
    })
}
const resetTurns = () => {
    board.classList.remove('o')
    board.classList.add('x')
}
const showFinalMessage = (mensaje) => {
    finalMessage.querySelector('h1').innerText = mensaje
    finalMessage.classList.add('show')
}