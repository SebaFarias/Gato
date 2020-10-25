const mode = {
    local: 'local-2P',
    bot: 'local-bot',
    remote: 'remote-2P',
}
const game = new Game(mode.local,false,'o','x')
const menu = new Menu( game, mode.local, e => { menuHandler(e)}, e => { submitHandler(e)} )
const remote = new Remote(menu , () => {newGame()}, i => {remoteMove(i)})
const board = document.getElementById('board')
const message = document.getElementById('msg')
const cells = document.querySelectorAll('.cell')
const modeOptions = document.querySelectorAll('.option')

cells.forEach( cell => { cell.addEventListener('click' , e => {boardHandler(e)})})
modeOptions.forEach( option => {option.addEventListener('click', e => {optionsHandler(e)})})
window.addEventListener('beforeunload', e => {remote.handleUnload()} )
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
  if(canIPlay()) return makeMove(clicked)
  setMsg('Hey! Turno del rival')
}
const menuHandler = event => {
  switch(event.target.classList[0]){
    case 'show': // click on menu's background
      if(document.getElementById('copyBtn'))return // until copy-code btn working
      if(!game.checkwin()){
        menu.newMenu()
        menu.setOption(game.getGameMode)
      }
      break
    case 'restart-btn':
      newGame()
      break
    case 'bot-start-btn':
      const botMark = event.target.classList[1] === 'x' ? 'o' : 'x' 
      game.setFacingMark(botMark)
      newGame()
      break        
    default: 
    //console.log(event.target.classList[0])// For development propuses only
  }
}
const submitHandler = event => {
  event.preventDefault()
  const clicked = event.submitter
  if(clicked.classList.contains('new')) remote.newConnection()
  if(clicked.classList.contains('join')){
    const code = document.getElementById('existing-code').value
    remote.joinConnection(code)
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
const newGame = () => {
  game.newGame(menu.option,game.facingMark)
  if(game.gameMode === mode.remote && !remote.wating()) remote.cleanBoard()
  resetBoard()
  showSelectedOption()
  menu.newMenu()
  switchTurns()
  nextTurn()
}
const makeMove = (cell) => {
  board.classList.contains('x') ? cell.classList.add('x') : cell.classList.add('o')
  const index = getIndex(cell)
  game.updateBoard(game.turn,index)  
  if(game.gameMode === mode.remote && !board.classList.contains(game.facingMark)) remote.sendMove(index)   
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
const remoteMove = move => {
  const index = move[0]
  const mark = move[1]
  if(mark === game.facingMark && cells[index].classList.length < 2){
    makeMove(cells[index])
  }
}
const nextTurn = () => {
  switchTurns()
  if(game.gameMode === mode.bot) botMove()
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
  message.childNodes[1].innerText = msg
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
