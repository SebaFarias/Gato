const API_URL = 'https://gato-server.herokuapp.com/api/v1'
const connectionRoute = '/connection'
const movesRoute = '/moves'
// class Connection{
//     constructor(code,id){
//         this.code = code
//         this.playerId = id
//     }
// }
const fetchMove = async game => {
    const {board,p2,lastUpdate} = await listenToMove(game.code)
    if( lastUpdate > game.lastUpdate){
        return board
    }else{
        return setTimeout( async () =>{
            await fetchMove(game)
        },2000)
    }
}
const createConnection = async () => {
    const data = await fetch(`${API_URL}${connectionRoute}/new`)
    return data.json()
}
const joinByCode = async code => {
    const reqBody = {connectionCode: code}
    const response = await fetch(`${API_URL}${connectionRoute}/join`,{
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
const disconnect = async game => {
    const reqBody = {
        connectionCode: game.code,
        id: game.playerId
    }
    const response = await fetch(`${API_URL}${connectionRoute}/disconnect`,{
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
const makeAMove = async (game,cell) => {
    const reqBody = {
        connectionCode: game.code,
        mark: game.otherMark(game.facingMark),
        cell: cell,
        isFinished: game.checkwin()? true : false
    }    
    const response = await fetch(`${API_URL}${movesRoute}/move`,{
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
const listenToMove = async code => {
    const data = await fetch(`${API_URL}${movesRoute}/${code}`)
    return data.json()
}
const cleanBoard = async code => {
    const reqBody = {
        connectionCode: game.code,
        mark: game.otherMark(game.facingMark),
        cell: cell,
        isFinished: game.checkwin()? true : false
    }    
    const response = await fetch(`${API_URL}${movesRoute}/restart/${code}`,{
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
const askRestart = async code => {

}
const askMarkChange = async code => {

}





