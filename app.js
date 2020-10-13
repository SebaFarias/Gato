const gamemodes = {
    local: 'local-2P',
    bot: 'local-bot',
    remote: 'remote-2P',
}
const game = new Game(gamemodes.local,false,'o','x','')
const board = document.querySelector('.board')
const cells = board.querySelectorAll('.cell')
const modeOptions = document.querySelectorAll('.option')
const message = document.querySelector('.message h1')
const menu = new Menu( game, gamemodes.local, event => { menuHandler(event)} )
menu.mountMenu()
// const botMenu = document.querySelector('#choose-mark')
// const remoteMenu = document.querySelector('.remote-config')
// const existingCode = document.querySelector('#existing-code')
// const finalMessage = document.querySelector('.final-message')
// const API_URL = 'http://localhost:8080/'

modeOptions.forEach( option => {option.addEventListener('click', e => {optionsHandler(e)})})
cells.forEach( cell => { cell.addEventListener('click' , e => {boardHandler(e)})})
// botMenu.addEventListener('click', (e) => {handleBotMenu(e)})
// remoteMenu.addEventListener('click', (e) =>{handleRemoteMenu(e)})
// finalMessage.addEventListener('click', (e) => {restart(e)})
/********************************* 
*       Table of Contents
*       1- Clicks Handler
*       2- Utils
*       3- Board changes
*       4- Views
*********************************/
/********************************
*
*       Clicks Handler
*
********************************/
const boardHandler = event =>{
    const clicked = event.target
    if(clicked.classList.contains('x') || clicked.classList.contains('o')) return
    if(canIPlay()) makeMove(clicked)
}
const menuHandler = event => {
    switch(event.target.classList[0]){
        case 'show': // click on menu's background
            if(game.checkwin() === false){
                menu.newMenu()
                menu.setOption(game.getGameMode)
            }
            break
        case 'restart-btn':
            game.newGame(menu.option,game.facingMark,'')
            cleanBoard()
            resetTurns()
            menu.newMenu()
            switchTurns()
            nextTurn()
            break
        case 'bot-start-btn':
            const botMark = event.target.classList[1] === 'x' ? 'o' : 'x' 
            game.newGame(gamemodes.bot,botMark,'')
            cleanBoard()
            resetTurns()
            menu.newMenu()
            switchTurns()
            nextTurn()
            break
        default: 
        console.log(event.target.classList[0])
    }
}
const optionsHandler = event => {
    const option = event.target.classList.contains('indicator') || event.target.classList.contains('gamemode') ?
        event.target.parentElement : event.target
    switch(option.classList[0]){
        case gamemodes.local:
            menu.setOption(gamemodes.local)
            menu.showRestart('¿Comenzar nueva Partida?')
            break
        case gamemodes.bot:
            menu.setOption(gamemodes.bot)
            menu.showBot()
            break
        case gamemodes.remote:
            menu.setOption(gamemodes.remote)
            menu.showRemote()
            break
    }
}
/********************************
*
*       Utils
*
********************************/
const getIndex = cell => {
    let index 
    Array.from(cells).map( (square, i) => {
        if (square === cell) index = i
    })
    return index
}
const canIPlay = () => {
    if(game.gameMode !== gamemodes.local && board.classList.contains(game.facingMark)) return false
    if(game.checkwin() !== false) return false
    return true
}
/********************************
*
*       Board changes
*
********************************/
const makeMove = (cell) => {
    board.classList.contains('x') ? cell.classList.add('x') : cell.classList.add('o')
    game.updateBoard(game.turn,getIndex(cell))      
    const winner = game.checkwin()
    winner? handleWinner(winner) : nextTurn()
}
const nextTurn = () => {
    switchTurns()
    switch(game.gameMode){
        case gamemodes.bot:
            botMove()
            break
        case gamemodes.remote:
            remoteMove()
            break
    }
}
const botMove = () => {
    if(board.classList.contains(game.facingMark)){
        let choosenCell,
        bestScore = -2
        game.board.map( (cell , index) =>{
            if(cell === ''){
                let moveScore = game.minimax(game.tryHere(game.board,index,true),false)                
                if(moveScore > bestScore ){
                    bestScore = moveScore
                    choosenCell = cells[index]
                }
            }
        })
        setTimeout(()=>{makeMove(choosenCell)},200)
    }
}
const remoteMove = async() => {
    if(board.classList.contains(game.facingMark)){
        const choosenCell = await fetchMove()
        makeMove(choosenCell)
    }
    // hacer el fetch a la API del próximo movimiento rival
}
const switchTurns = () => {
    board.classList.toggle('x')
    board.classList.toggle('o')
    game.switchTurns()
    setMsg(null)    
}
const handleWinner = (winner) => {
    if(winner !== 'draw'){
        menu.showRestart(`${winner.toLocaleUpperCase()} ha Ganado!`)
        game.getWinningLine(winner).forEach( className => {
            board.classList.add(className)
        })
    }else{
        menu.showRestart('Es un empate!')
        }
}
/********************************
*
*       Views
*
********************************/
const setMsg = (text) => {
    let msg = text
    if(msg === null){ 
        msg = game.gameMode === gamemodes.local ? 
            `Turno de ${game.turn.toLocaleUpperCase()}` 
            : board.classList.contains(game.facingMark)? 'Turno del rival' : 'Tu turno'
    }
    message.innerText = msg
}
const cleanBoard = () => {
    cells.forEach( cell => {
        cell.classList.remove('x','o')
    })
    board.classList.remove('h','v','up','down','center','left','right','d-down','d-up')
}
const resetTurns = () => {
    board.classList.remove('o')
    board.classList.add('x')
}
//*************************     Old stuff     *************************
//*************************     Alteraciones al Tablero     *************************
//*************************      Consultas de estados       ************************* 
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
//*************************         Modos de Juego           *************************
const restart = (e) => {
    if(e.target.classList.contains('restart-btn')){
        if(option === gamemodes.local){
            cleanBoard()
            resetTurns()
            gameMode = gamemodes.local
            matchStarted = false
            showSelectedMode(`.${gamemodes.local}`)
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


//*************************         Menus y Vistas           *************************

const changeGameMode = (event) => {
    const selectedOption = event.target.parentElement
    if(selectedOption.classList.contains('local-2P')){
        option = gamemodes.local
        showFinalMessage('¿Comenzar nueva Partida?')
    }
    if(selectedOption.classList.contains('local-bot'))botMenu.classList.add('show');
    if (selectedOption.classList.contains('remote-2P'))remoteMenu.classList.add('show');
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
//*************************          HTTP Requests           *************************
const sendNewMatchReq = () => {
    fetch(API_URL+'/newConnection')
        .then( res => {
        return res.json();
    })
        .then(data => console.log(data))
}
const sendJoinReq = (code) => {
    fetch(API_URL,{
        method: 'POST',
        body: JSON.stringify({
            code: code
        }),
        headers: {
            'content-type': 'application/json'
        }        
    })
}   