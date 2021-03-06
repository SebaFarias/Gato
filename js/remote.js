const CODE_REGEX = /^[A-Z0-9]{4}-[A-Z0-9]{4}$/g,
// API_URL = 'http://localhost:8080/api/v1', //DEV
API_URL = 'https://gato-server.herokuapp.com/api/v1', //PRODUCTION
CON_ROUTE = '/connection',
MOVES_ROUTE = '/moves',
MS_TO_REFRESH = 2000

class Remote{
  constructor(menu, startFunction, moveFunction){
    this.menu = menu
    this.game = menu.game
    this.start = startFunction
    this.move = moveFunction
    this.code = ''
    this.waitingFoe = true
    this.lastUpdate = new Date('1970-01-01Z00:00:00:000')
    this.amIHosting = false
    this.playerId = ''
    this.foeId = ''
    this.interval = null
  }
  getCode(){
    return this.code
  }
  hosting(){
    return this.amIHosting
  }
  waiting(){
    return this.waitingFoe
  }
  getMyId(){
    return this.playerId
  }
  getFoeId(){
    return this.foeId
  }
  getUpdatedAt(){
    return this.lastUpdate
  }
  setCode(code){
    this.code = code
  }
  setMyId(id){
    this.playerId = id
  }
  setFoeId(id){
    this.foeId = id
  }
  setUpdatedAt(dateTime){
    this.lastUpdate = dateTime
  }
  setHosting(bool){
    this.amIHosting = bool
  }
  startWaiting(){
    this.waitingFoe = true
  }
  stopWaiting(){
    this.waitingFoe = false
  }
  async newConnection(){
    this.menu.showConnecting('Conectando con el servidor ...',true)
    await this.createConnection()
    .then(res => {
      this.setHosting(true)
      this.setCode(res.connectionCode)
      this.setMyId(res.yourId)
      this.setUpdatedAt(new Date(res.lastUpdate))
      this.menu.showConnecting('Partida creada, comparte el código para comenzar', false, this.code)
    })
    this.startListening()
  }
  joinConnection(code){
    const formatedCode = code.toLocaleUpperCase()
    if(!formatedCode.match(CODE_REGEX)) return this.menu.showRemote('Ingrese un código válido')
      this.menu.showConnecting('Buscando la partida ...',true)
      this.setCode(formatedCode)
      this.joinByCode()
      .then( data => {
        if(data.msj) return this.menu.showRemote(data.msj)
        this.setCode(data.connectionCode)
        this.setMyId(data.yourId)
        this.setUpdatedAt(new Date(data.lastUpdate))
        this.menu.setOption('remote-2P')
        this.game.setFacingMark('x')
        this.start()
        this.startListening()
      })
  }
  handleUnload(){
    if(this.game.gameMode !== 'remote-2P' || this.getCode() === '') return
    this.disconnect()
  }
  handleNewGame(){
    this.startWaiting()
    this.cleanBoard()
    this.menu.showConnecting('Esperando al servidor ...',true)
  }
  startListening(){
    this.interval = setInterval( () => {
      this.checkStatus(this.fetchStatus())
    },MS_TO_REFRESH)
  }
  refreshWaiting(waiting){
    if(waiting === ''){
      this.stopWaiting()
    }else{
      this.startWaiting()
    }
  }
  refreshHost(hostID,guestID){
    this.setHosting( hostID === this.getMyId())
    if(! this.hosting()) return this.setFoeId(hostID)
    this.setFoeId(guestID !== null && typeof guestID !== 'undefined'? guestID : '')
  }
  compareBoard(serverBoard,time,turn){
    const board = this.game.board
    const differences = []
    serverBoard.map( (cell, index) =>{
      if(cell !== board[index]) differences.push({
        index: index,
        mark: cell
      })
    })
    if(this.game.checkwin() === false && differences.length > 0){
      differences.map( difference =>{
        this.move(difference,turn)
      })
      this.setUpdatedAt(time)
    }
  }
  checkStatus(res){
    res.then(data => {
      this.refreshHost(data.p1,data.p2)
      if(this.waiting() && data.waiting === '' ){
        this.menu.setOption('remote-2P')
        this.hosting() ? this.game.setFacingMark('o') : this.game.setFacingMark('x')
        this.refreshWaiting(data.waiting)      
        this.start()
      }      
      if(new Date(data.lastUpdate) > this.getUpdatedAt()){
        if(!this.waiting()){
          this.compareBoard(data.board,new Date(data.lastUpdate),data.turn)
        }
      }
    })
  }
/********************************
*
*       API Calls
*
********************************/
  async createConnection(){
    const response = await fetch(`${API_URL}${CON_ROUTE}/new`)
    .catch( err => {
      console.log(err)
    })
    return response.json()
  }
  async joinByCode(){
    const reqBody = {connectionCode: this.getCode()}
    const response = await fetch(`${API_URL}${CON_ROUTE}/join`,{
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-type': 'application/json'
      },
      redirect: "follow",
      referrerPolicy: 'no-referrer',
      body:JSON.stringify(reqBody)
  }).catch( error => {
      this.menu.showRemote('Ha ocurrido un error, inténtalo de nuevo')
      console.log(error)
    })
    return response.json()    
  }
  async fetchStatus(){
    let response 
    await fetch(`${API_URL}${CON_ROUTE}/${this.getCode()}`)
    .then(res => {
      response = res.json()
    })
    .catch( err => {
      console.log(err)
    })
    return response
  }
  async disconnect(){
    const reqBody = {
      connectionCode: this.getCode(),
      id: this.getMyId()
    }
    const response = await fetch(`${API_URL}${CON_ROUTE}/disconnect`,{
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
          'Content-type': 'application/json'
      },
      redirect: "follow",
      referrerPolicy: 'no-referrer',
      body:JSON.stringify(reqBody)
    })
    this.setHosting(false)
    this.setCode('')
    this.setMyId('')
    this.setUpdatedAt(new Date('1970-01-01Z00:00:00:000'))
    return response.json()    
  }
  async sendMove(cell){
    const reqBody = {
      connectionCode: this.getCode(),
      mark: this.game.otherMark(this.game.facingMark),
      cell: cell,
      isFinished: !(this.game.checkwin() === false)
  }    
  const response = await fetch(`${API_URL}${MOVES_ROUTE}/move`,{
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-type': 'application/json'
    },
    redirect: "follow",
    referrerPolicy: 'no-referrer',
    body:JSON.stringify(reqBody)
  })
    return response.json()        
  }    
  async cleanBoard(){  
    const reqBody = {
      id: this.getMyId()
    }
    const response = await fetch(`${API_URL}${MOVES_ROUTE}/restart/${this.getCode()}`,{
      method: 'POST',
      mode:'cors', 
      cache: 'no-cache',
      headers: {
        'Content-type': 'application/json'
      },
      redirect: "follow",
      referrerPolicy: 'no-referrer',
      body:JSON.stringify(reqBody)
    })
    .catch( err => {
      console.log('Server error: ',err)
    })
    return response.json()      
  }
  async askRestart(){
  
  }
  async askMarkChange(){
  
  }
}