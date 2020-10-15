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


modeOptions.forEach( option => {option.addEventListener('click', e => {optionsHandler(e)})})
cells.forEach( cell => { cell.addEventListener('click' , e => {boardHandler(e)})})
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
            if(!game.checkwin()){
                menu.newMenu()
                menu.setOption(game.getGameMode)
            }
            break
        case 'restart-btn':
            game.newGame(menu.option,game.facingMark,'')
            cleanBoard()
            resetTurns()
            showSelectedOption()
            menu.newMenu()
            switchTurns()
            nextTurn()
            break
        case 'bot-start-btn':
            const botMark = event.target.classList[1] === 'x' ? 'o' : 'x' 
            game.newGame(gamemodes.bot,botMark,'')
            cleanBoard()
            resetTurns()
            showSelectedOption()
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
        const board = await fetchMove(game.lastUpdate)
        const choosenCell = cells[game.checkDifference(board)]
        makeMove(choosenCell)
    }
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
const showSelectedOption = () => {
    modeOptions.forEach( option =>{
        option.classList.contains(game.gameMode)?
        option.classList.add('selected') : option.classList.remove('selected')
    })
}
const resetTurns = () => {
    board.classList.remove('o')
    board.classList.add('x')
}

