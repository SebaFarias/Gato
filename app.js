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
],
gamemodes = {
    local2P: 'local-2P',
    bot: 'local-bot'
}
let gameMode = gamemodes.local2P,
option = 'local-2P'
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
    let winner = checkWin(cells)
    if(winner !== false)showFinalMessage(`${winner.toUpperCase()} ha ganado !`)
    else if(isFinnished(cells))showFinalMessage('Es un empate!')
    if(!isFinnished(cells))botMove()
}
const isBotsTurn = () => {
    if(gameMode === gamemodes.bot && board.classList.contains(botMark))return true
    return false
}
const botMove = () => {
    if(isBotsTurn()){
        let choosenCell,
        minDepth =99 ,
        bestScore = -2
        cells.forEach( (cell , index) =>{
            if(isFree(cell)){
                let eval = easyBot(tryHere(cells,index,true),false,0)                
                //console.log(`${eval[0]} > ${bestScore} : ${eval[0] > bestScore}`);
                //console.log(`${eval[0]} === ${bestScore} && ${eval[1]} < ${minDepth} : ${eval[0] === bestScore && eval[1] < minDepth}`);
                if(eval[0] > bestScore ){
                    bestScore = eval[0]
                    choosenCell = cell
                }else{
                    if(eval[0] === bestScore && eval[1] < minDepth){
                        minDepth = eval[1]
                        choosenCell = cell
                    }    
                }
            }
        })
        makeMove(choosenCell)
    }
}
const tryHere = ( _board , i , isBot) => {
    let simpleBoard = [' ',' ',' ',' ',' ',' ',' ',' ',' ']
    if(typeof(_board[0]) !== "string" ){
        _board.forEach( (cell,index) => {
            if(cell.classList.contains('x')) simpleBoard[index] = 'x'
            if(cell.classList.contains('o')) simpleBoard[index] = 'o'
            if(index === i) simpleBoard[index] = isBot? botMark : otherMark(botMark)
        })
    }else{
        simpleBoard = _board
        simpleBoard[i] = isBot? botMark : otherMark(botMark)
    }
    return simpleBoard
}
const otherMark = mark => {
    return mark === 'x' ? 'o' : 'x' 
}
const easyBot = (_board,isMaximizer,depht) => {
    let winner = checkWin(_board)
    if(isFinnished(_board)){
        if(winner === false)return [0,depht]
        return winner === botMark? [1,depht] : [-1,depht]
    }
    if(isMaximizer){
        let bestScore = -2
        _board.forEach((cell,index) => {
            if(cell === ' '){
                let eval = easyBot(tryHere(_board,index,true),false,depht+1)
                bestScore = Math.max(eval[0],bestScore)
            }
        })
        return [bestScore,Math.max(depht,eval[1])]
    }else{
        let bestScore = 2
        _board.forEach((cell,index) => {
            if(cell === ' '){
                let eval = easyBot(tryHere(_board,index,false),true,depht+1)
                bestScore = Math.min(eval[0],bestScore)
            }
        })
        return [bestScore,Math.max(depht,eval[1])]
    }
}
const handleBotMenu = (event) => {
    let clicked = event.target 
    if(clicked.classList.contains('bot-start-btn'))newBotGame(clicked)
    else if(!isFinnished(cells))botMenu.classList.remove('show')
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
const changeGameMode = (event) => {
    const selectedOption = event.target.parentElement
    if(selectedOption.classList.contains('local-2P')){
        option = gamemodes.local2P
        showFinalMessage('¿Comenzar nueva Partida?')
    }
    if(selectedOption.classList.contains('local-bot'))botMenu.classList.add('show');
}
const newBotGame = (playerMark) => {
    botMark = playerMark.classList.contains('x')? 'o' : 'x'
    matchStarted = true
    gameMode = gamemodes.bot
    option = gamemodes.bot
    cleanBoard()
    resetTurns()
    botMove()
    showSelectedMode('.local-bot')
    botMenu.classList.remove('show')
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
        if(option === gamemodes.local2P){
            cleanBoard()
            resetTurns()
            gameMode = gamemodes.local2P
            matchStarted = false
            showSelectedMode(`.${gamemodes.local2P}`)
            finalMessage.classList.remove('show')
        }
        if(option === gamemodes.bot){
            newBotGame(botMenu.querySelector(`.${botMark === 'x'? 'o': 'x'}`))
            finalMessage.classList.remove('show')
        }
    }
    if(!isFinnished(cells))finalMessage.classList.remove('show')
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