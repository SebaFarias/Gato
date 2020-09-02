const winningCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]
const gamemodes = {
    local2P: 'local-2P',
    bot: 'local-bot',
    remote2P: 'remote-2P',
}
const board = document.querySelector('.board')
const cells = board.querySelectorAll('.cell')
const modeOptions = document.querySelectorAll('.option')
const botMenu = document.querySelector('#choose-mark')
const remoteMenu = document.querySelector('.remote-config')
const existingCode = document.querySelector('#existing-code')
const finalMessage = document.querySelector('.final-message')
const message = document.querySelector('.message h1')
const API_URL = 'http://localhost:8080/api'

let gameMode = gamemodes.local2P
let option = 'local-2P'
let matchStarted = false
let nonClientMark = 'o'
let matchCode = ''

cells.forEach( cell => { cell.addEventListener('click' , (e) => {makeMove(e.target)})})
modeOptions.forEach( option => {option.addEventListener('click', (e) => {changeGameMode(e)})})
botMenu.addEventListener('click', (e) => {handleBotMenu(e)})
remoteMenu.addEventListener('click', (e) =>{handleRemoteMenu(e)})
finalMessage.addEventListener('click', (e) => {restart(e)})

//*************************     Alteraciones al Tablero     *************************
const makeMove = (cell) => {
    if(!board.classList.contains('blocked')){
        if(cell!== false && isFree(cell)){
            if(board.classList.contains('x')){
                cell.classList.add('x')
            } else{
                cell.classList.add('o')
            }              
            matchStarted = true
            switchTurns()
        }
        let winner = checkWin(cells)
        if(winner !== false)showFinalMessage(`${winner.toUpperCase()} ha ganado !`)
        else if(isFinnished(cells))showFinalMessage('Es un empate!')
        if(!isFinnished(cells))botMove()
    }
}
const switchTurns = () => {
    board.classList.toggle('x')
    board.classList.toggle('o')
    if(gameMode === gamemodes.remote2P ) board.classList.toggle('blocked')
    setMsg(null)    
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
//*************************      Consultas de estados       ************************* 
const isBotsTurn = () => {
    if(gameMode === gamemodes.bot && board.classList.contains(nonClientMark))return true
    return false
}
const isMyTurn = () => {
    return board.classList.contains(otherMark(nonClientMark))
}
const isFree = (cell) =>{
    if(typeof(cell) === 'string'){
        if(cell !== ' ') return false
    }
    else{ 
        if(cell.classList.contains('x') || cell.classList.contains('o')) return false
    }
    return true
}
const checkWin = (cellsToCheck) => {
    if(typeof(cellsToCheck[0]) === 'string'){
        if(winningCombinations.some(combination => {
            return combination.every(element => {
                return cellsToCheck[element] === 'x'
            })
        }))return 'x'
        if(winningCombinations.some(combination => {
            return combination.every(element => {
                return cellsToCheck[element] === 'o'
            })
        }))return 'o'
    }else{
        if(winningCombinations.some(combinacion => {
            return combinacion.every(element => {
                return cellsToCheck[element].classList.contains('x')
            })
        }))return 'x'
        if(winningCombinations.some(combinacion => {
            return combinacion.every(element => {
                return cellsToCheck[element].classList.contains('o')
            })
        }))return 'o'
    }
    return false
}
const isFinnished = (cellsToCheck) => {
    if(checkWin(cellsToCheck) !== false)return true
    for( i=0 ; i < cellsToCheck.length ; i++){
        if(isFree(cellsToCheck[i]))return false
    }
    return true
}
const otherMark = mark => {
    return mark === 'x' ? 'o' : 'x' 
}
//*************************         Modos de Juego           *************************
const restart = (e) => {
    if(e.target.classList.contains('restart-btn')){
        if(option === gamemodes.local2P){
            cleanBoard()
            resetTurns()
            gameMode = gamemodes.local2P
            matchStarted = false
            showSelectedMode(`.${gamemodes.local2P}`)
            finalMessage.classList.remove('show')
        }
        if(option === gamemodes.bot){
            newBotGame(botMenu.querySelector(`.${nonClientMark === 'x'? 'o': 'x'}`))
            finalMessage.classList.remove('show')
        }
    }
    setMsg(null)
    if(!isFinnished(cells))finalMessage.classList.remove('show')
}
const newBotGame = (playerMark) => {
    nonClientMark = playerMark.classList.contains('x')? 'o' : 'x'
    matchStarted = false
    gameMode = gamemodes.bot
    option = gamemodes.bot
    cleanBoard()
    resetTurns()
    botMove()
    showSelectedMode('.local-bot')
    setMsg(null)
    botMenu.classList.remove('show')
}
//*************************       Movimientos del Bot        *************************
const botMove = () => {
    if(isBotsTurn()){
        let choosenCell,
        bestScore = -2
        cells.forEach( (cell , index) =>{
            if(isFree(cell)){
                let moveScore = minimax(tryHere(cells,index,true),false)                
                if(moveScore > bestScore ){
                    bestScore = moveScore
                    choosenCell = cell
                }
            }
        })
        setTimeout(()=>{makeMove(choosenCell)},400)
    }
}
const minimax = (_board,isMaximizer) => {
    let winner = checkWin(_board)
    if(isFinnished(_board)){
        if(winner === false){
            return 0    
        }
        return winner === nonClientMark? 1 : -1
    }
    if(isMaximizer){
        let bestScore = -2
        _board.forEach((cell,index) => {
            if(cell === ' '){
                let moveScore = minimax(tryHere(_board,index,true),false)                
                bestScore = Math.max(moveScore,bestScore)
            }
        })
        return bestScore
    }else{
        let bestScore = 2
        _board.forEach((cell,index) => {
            if(cell === ' '){
                let moveScore = minimax(tryHere(_board,index,false),true)
                bestScore = Math.min(moveScore,bestScore)
            }
        })
        return bestScore
    }
}
const tryHere = ( _board , i , isBot) => {
    let simpleBoard = [' ',' ',' ',' ',' ',' ',' ',' ',' ']
    if(typeof(_board[0]) !== 'string' ){
        _board.forEach( (cell,index) => {
            if(cell.classList.contains('x')) simpleBoard[index] = 'x'
            if(cell.classList.contains('o')) simpleBoard[index] = 'o'
            if(index === i) simpleBoard[index] = isBot? nonClientMark : otherMark(nonClientMark)
        })
    }else{
        simpleBoard = [..._board]
        simpleBoard[i] = isBot? nonClientMark : otherMark(nonClientMark)
    }
    return simpleBoard
}
//*************************         Menus y Vistas           *************************
const changeGameMode = (event) => {
    const selectedOption = event.target.parentElement
    if(selectedOption.classList.contains('local-2P')){
        option = gamemodes.local2P
        showFinalMessage('¿Comenzar nueva Partida?')
    }
    if(selectedOption.classList.contains('local-bot'))botMenu.classList.add('show');
    if (selectedOption.classList.contains('remote-2P'))remoteMenu.classList.add('show');
}
const setMsg = (text) => {
    if(text === null){ 
        if(gameMode !== gamemodes.local2P){ 
            let text = isMyTurn()? 'Tu turno' : 'Turno del rival'
            message.innerText = text        
        }
        else message.innerText = `Turno de ${board.classList.contains('x')? 'X' : 'O'}`
    }
    else message.innerText = text
}
const showSelectedMode = (mode) => {
    modeOptions.forEach(option => {
        option.querySelector('.indicator').classList.remove('selected')
    })
    document.querySelector(mode).querySelector('.indicator').classList.add('selected')
}
const handleBotMenu = (event) => {
    let clicked = event.target 
    if(clicked.classList.contains('bot-start-btn'))newBotGame(clicked)
    else if(!isFinnished(cells))botMenu.classList.remove('show')
}
const handleRemoteMenu = (event) =>{
    event.preventDefault()
    let clicked = event.target
    if(clicked.classList.contains('new'))createNewMatch()
    else if(clicked.classList.contains('join'))joinExistingMatch(existingCode.value)
    else if(clicked.classList.contains('remote-config'))remoteMenu.classList.remove('show')
}
const createNewMatch = () => {
    sendNewMatchReq()
    console.log('new btn pressed');
}
const joinExistingMatch = (code) => {
    sendJoinReq(code)
    console.log(`Join btn pressed try: ${code}`);
} 

const showFinalMessage = (mensaje) => {
    finalMessage.querySelector('h1').innerText = mensaje
    finalMessage.classList.add('show')
}
const won = (winner) => {
    showFinalMessage(`${winner} ha ganado !`)
}
const draw = () => {
    showFinalMessage('Es un empate!')
}
//*************************          HTTP Requests           *************************
const sendNewMatchReq = () => {
    fetch(API_URL+'/newConnection')
        .then( res => {
        return res.json();
    })
        .then(data => console.log(data))
}
const sendJoinReq = (code) => {
    fetch(API_URL + '/join',{
        method: 'POST',
        body: JSON.stringify({
            code: code
        }),
        headers: {
            'content-type': 'application/json'
        }        
    })
}   