class Game{
  constructor(gamemode,started,foe,turn){
    this.gameMode = gamemode
    this.started = started
    this.facingMark = foe
    this.turn = turn
    this.board = ['','','','','','','','','',]
    this.winningCombinations = [
      [0,1,2],    [3,4,5],    [6,7,8],
      [0,3,6],    [1,4,7],    [2,5,8],
      [0,4,8],    [2,4,6],
    ]
  }
    //Getters
    getGameMode(){
        return this.gameMode
    }
    getSarted(){
        return this.matchStarted
    }
    getOption(){
        return this.option
    }
    getFacingMark(){
        return this.facingMark
    }
    getBoard(){
        return this.board
    }
    getTurn(){
        return this.turn
    }
    //Setters
    setGameMode(gamemode){
        this.gameMode = gamemode
    } 
    setStarted(started){
        this.matchStarted = started
    } 
    setOption(option){
        this.option = option
    } 
    setFacingMark(mark){
        this.facingMark = mark
    } 
    setBoard(board){
        this.board = board
    }
    setTurn(turn){
        this.turn = turn
    }
    //Utils
    updateBoard(mark,cell){
        if (this.board[cell] !== '') return false
        this.board[cell] = mark
        this.started = true
        return true
    }
    switchTurns(){
        this.turn = this.turn === 'o'? 'x' :'o' 
    }
    checkwin(board = this.board){    
        if(this.winningCombinations.some( trio => {
        return trio.every( index => {
        return board[index] === 'x'})})){
            return 'x'
        }else if(this.winningCombinations.some( trio => {
        return trio.every( index => {
        return board[index] === 'o'})})){
            return 'o'
        }else if(board.every( cell => {
        return cell !== ''})){
            return 'draw'
        }
            return false
    }
    getWinningLine(winnerMark){
        let winningCombination
        this.winningCombinations.map( (trio,index) =>{
            if(trio.every( cell =>{
                return this.board[cell] === winnerMark
            })){
                winningCombination = index
            }
        })
        switch(winningCombination){
            case 0:
                return ['h','up']
            case 1:
                return ['h','center']
            case 2:
                return ['h','down']
            case 3:
                return ['v','left']
            case 4:
                return ['v','center']
            case 5:
                return ['v','right']
            case 6:
                return ['h','d-down']
            case 7:
                return ['h','d-up']
            default:
                return []
        }
    }
    newGame(gamemode,foe){
        this.gameMode = gamemode
        this.started = false
        this.facingMark = foe
        this.turn = 'x'
        this.board = ['','','','','','','','','',]
    }
    tryHere( board , i , isBot){
        const simpleBoard = [...board]
        simpleBoard[i] = isBot? this.facingMark : this.otherMark(this.facingMark)
        return simpleBoard
    }
    otherMark(mark){
        return mark === 'x' ? 'o' : 'x' 
    }
    minimax(board,isMaximizer){
        const winner = this.checkwin(board)
        if(!winner){
            if(isMaximizer){
                let bestScore = -2
                board.map((cell,index) => {
                    if(cell === ''){
                      const moveScore = this.minimax(this.tryHere(board,index,true),false)                
                      bestScore = Math.max(moveScore,bestScore)
                    }
                })
                return bestScore
            }else{
                let bestScore = 2
                board.map((cell,index) => {
                    if(cell === ''){
                        const moveScore = this.minimax(this.tryHere(board,index,false),true)
                        bestScore = Math.min(moveScore,bestScore)
                    }
                })
                return bestScore
            }}
        if(winner === 'draw') return 0    
        return winner === this.facingMark? 1 : -1
    }
}