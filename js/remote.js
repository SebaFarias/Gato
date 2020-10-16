class Remote{
    constructor(menu, startFunction){
        this.CODE_REGEX = /^[A-Z0-9]{4}-[A-Z0-9]{4}$/g
        this.API_URL = 'https://gato-server.herokuapp.com/api/v1'
        this.CON_ROUTE = '/connection'
        this.MOVES_ROUTE = '/moves'
        this.MAX_API_CALLS_BEFORE_TIMEOUT = 5
        this.MS_TO_REFRESH = 2000
        this.start = startFunction
        this.menu = menu
        this.game = menu.game
        this.code = ''
        this.lastUpdate = new Date('1970-01-01Z00:00:00:000')
        this.amIHosting = false
        this.playerId = ''
        this.foeId = ''
    }
    getCode(){
        return this.code
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
    newConnection(){
        this.menu.showConnecting('Conectando con el servidor ...',true)
        this.createConnection()
        .then(res => {
            this.setHosting(true)
            this.setCode(res.connectionCode)
            this.setMyId(res.yourId)
            this.setUpdatedAt(new Date(res.lastUpdate))
            this.menu.showConnecting('Partida creada, comparte el código para comenzar', false, this.code)
            this.fetchMove()
            .then(() => {
                this.menu.setOption('remote-2P')
                this.game.facingMark('o')
                this.start()
            }).catch( res => {
                console.log('mala cosa',res) //Change this
            })
        })
    }
    joinConnection(code){
        const formatedCode = code.toLocaleUpperCase()
        if(!formatedCode.match(this.CODE_REGEX)) return this.menu.showRemote('Ingrese un código válido')
            this.menu.showConnecting('Buscando la partida ...',true)
            this.setCode(formatedCode)
            this.joinByCode()
            .then( data => {
                if(data.msj) return this.menu.showRemote(data.msj)
                this.setCode(data.connectionCode)
                this.setMyId(data.yourId)
                this.game.setBoard(data.board)
                this.setUpdatedAt(data.lastUpdate)
                this.menu.setOption('remote-2P')
                this.game.setFacingMark('x')
                this.start()
            })
    }
    handleUnload(event){
        if(this.game.gameMode !== 'remote-2P' || this.getCode() === '') return
        this.disconnect()
    }
    fetchMove(times = 0){
        return new Promise((resolve,reject) => {
            this.listenToMove()
            .then(res => {
                console.log('clean');
                resolve(res)
            }).catch( reason => {
                if(reason != 'static') return reject(reason)
                if(times > this.MAX_API_CALLS_BEFORE_TIMEOUT) return reject('timeout')
                resolve(setTimeout( () => { this.fetchMove(times + 1) } , this.MS_TO_REFRESH))                
            })                             
        })
    }
/********************************
*
*       API
*
********************************/
    async createConnection(){
        const response = await fetch(`${this.API_URL}${this.CON_ROUTE}/new`)
        .catch()
        return response.json()
    }
    async joinByCode(){
        const reqBody = {connectionCode: this.getCode()}
        const response = await fetch(`${this.API_URL}${this.CON_ROUTE}/join`,{
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
    async disconnect(){
        const reqBody = {
            connectionCode: this.getCode(),
            id: this.getId()
        }
        const response = await fetch(`${this.API_URL}${this.CON_ROUTE}/disconnect`,{
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
    async sendMove(cell){
        const reqBody = {
            connectionCode: this.getCode(),
            mark: this.game.otherMark(this.game.facingMark),
            cell: cell,
            isFinished: this.game.checkwin()? true : false
        }    
        const response = await fetch(`${this.API_URL}${this.MOVES_ROUTE}/move`,{
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
    listenToMove(){
        return new Promise( (resolve,reject) =>{
            fetch(`${this.API_URL}${this.MOVES_ROUTE}/${this.getCode()}`)
            .then( res => {
                return res.json()
            }).then( data => {
                if(new Date(data.lastUpdate) <= this.getUpdatedAt()) return reject('static')
                console.log('llegamoh');
                resolve(data)
            }).catch( err => {
                reject(err)
            })
        })
    }
    async cleanBoard(){  
        const response = await fetch(`${this.API_URL}${this.MOVES_ROUTE}/restart/${this.getCode()}`)
        return response.json()    
    
    }
    async askRestart(){
    
    }
    async askMarkChange(){
    
    }
}





