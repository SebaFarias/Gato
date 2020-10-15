class Remote{
    constructor(menu){
        this.API_URL = 'https://gato-server.herokuapp.com/api/v1'
        this.CON_ROUTE = '/connection'
        this.MOVES_ROUTE = '/moves'
        this.menu = menu
        this.game = menu.game
        this.lastUpdate = new Date('1970-01-01Z00:00:00:000')
        this.code = ''
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
    setCode(code){
        this.code = code
    }
    setMyId(id){
        this.playerId = id
    }
    setFoeId(id){
        this.foeId = id
    }
    async fetchMove(){
        const {board,p2,lastUpdate} = await listenToMove(this.getCode())
        if( lastUpdate > this.lastUpdate){
            return board
        }else{
            return setTimeout( async () =>{
                await fetchMove()
            },2000)
        }
    }
/********************************
*
*       API
*
********************************/
    async createConnection(){
        const data = await fetch(`${this.API_URL}${this.CON_ROUTE}/new`)
        return data.json()
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
    async listenToMove(){
        const data = await fetch(`${this.API_URL}${this.MOVES_ROUTE}/${this.getCode()}`)
        return data.json()
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





