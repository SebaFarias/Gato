const API_URL = 'http://localhost:8080/'

const fetchMove = async updatedAt => {
    const {board,p2,lastUpdate} = await '' // make the fetch
    if( lastUpdate > updatedAt){
        return board
    }else{
        return setTimeout( ()=>{
            await fetchMove(updatedAt)
        },2000)
    }
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