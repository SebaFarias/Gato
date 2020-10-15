const mode = {
    local: 'local-2P',
    bot: 'local-bot',
    remote: 'remote-2P',
}
const game = new Game(mode.local,false,'o','x','')
const menu = new Menu( game, mode.local, e => { menuHandler(e)} )
const board = document.getElementById('board')
const message = document.getElementById('msg')
const cells = document.querySelectorAll('.cell')
const modeOptions = document.querySelectorAll('.option')

cells.forEach( cell => { cell.addEventListener('click' , e => {boardHandler(e)})})
modeOptions.forEach( option => {option.addEventListener('click', e => {optionsHandler(e)})})
/********************************* 
*       Table of Contents
*       1- Click Handlers
*       2- Board changes
*       3- Views
*       4- Utils
*********************************/
/********************************
*
*       1- Clicks Handlers
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
            resetBoard()
            showSelectedOption()
            menu.newMenu()
            switchTurns()
            nextTurn()
            break
        case 'bot-start-btn':
            const botMark = event.target.classList[1] === 'x' ? 'o' : 'x' 
            game.newGame(mode.bot,botMark,'')
            resetBoard()
            showSelectedOption()
            menu.newMenu()
            switchTurns()
            nextTurn()
            break
        case 'new':
            event.preventDefault()
            break
        case 'join':
            event.preventDefault()
            break
        default: 
        console.log(event.target.classList[0])
    }
}
const optionsHandler = event => {
    const option = event.target.classList.contains('indicator') || event.target.classList.contains('gamemode') ?
        event.target.parentElement : event.target
    switch(option.classList[0]){
        case mode.local:
            menu.setOption(mode.local)
            menu.showRestart('¿Comenzar nueva Partida?')
            break
        case mode.bot:
            menu.setOption(mode.bot)
            menu.showBot()
            break
        case mode.remote:
            menu.setOption(mode.remote)
            menu.showRemote()
            break
    }
}
/********************************
*
*       2- Board changes
*
********************************/
const makeMove = (cell) => {
    board.classList.contains('x') ? cell.classList.add('x') : cell.classList.add('o')
    game.updateBoard(game.turn,getIndex(cell))      
    const winner = game.checkwin()
    winner? handleWinner(winner) : nextTurn()
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
        const board = await fetchMove(game)
        const choosenCell = cells[game.checkDifference(board)]
        makeMove(choosenCell)
    }
}
const nextTurn = () => {
    switchTurns()
    if(game.gameMode === mode.bot) botMove()
    if(game.gameMode === mode.remote) remoteMove()
}
const switchTurns = () => {
    board.classList.toggle('x')
    board.classList.toggle('o')
    game.switchTurns()
    setMsg(null)    
}
/********************************
*
*       3- Views
*
********************************/
const setMsg = (text) => {
    let msg = text
    if(msg === null){ 
        msg = game.gameMode === mode.local ? 
            `Turno de ${game.turn.toLocaleUpperCase()}` 
            : board.classList.contains(game.facingMark)? 'Turno del rival' : 'Tu turno'
    }
    message.innerText = msg
}
const handleWinner = (winner) => {
    if(winner === 'draw'){
        menu.showRestart('Es un empate!')
    }else{
        menu.showRestart(`${winner.toLocaleUpperCase()} ha Ganado!`)
        board.classList.add(...game.getWinningLine(winner))
    }    
}
const showSelectedOption = () => {
    modeOptions.forEach( option =>{
        option.classList.contains(game.gameMode)?
        option.classList.add('selected') : option.classList.remove('selected')
    })
}
const resetBoard = () => {
    board.classList.remove('o','h','v','up','down','center','left','right','d-down','d-up')
    board.classList.add('x')
    cells.forEach( cell => {
        cell.classList.remove('x','o')
    })
}
/********************************
*
*       4- Utils
*
********************************/
const getIndex = cell => {
    let index 
    cells.forEach( (square, i) => {
        if (square === cell) index = i
    })
    return index
}
const canIPlay = () => {
    if(game.gameMode !== mode.local && board.classList.contains(game.facingMark)) return false
    if(game.checkwin() !== false) return false
    return true
}
