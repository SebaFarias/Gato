class Menu{
    constructor(game,option,handler,onSubmit){
        this.game = game
        this.menu = this.newMenu()
        this.option = option
        this.handler = handler
        this.onSubmit = onSubmit
    }
    setOption(option){
        this.option = option
    }
    newMenu(){
        if(document.getElementById('menu'))document.getElementById('menu').remove()
        const menu = document.createElement('div')
        menu.setAttribute('id','menu')
        menu.classList = []
        menu.innerHTML = ''
        return menu
    }
    mountMenu(){
        document.body.appendChild(this.menu)
    }
    newBotMenu(){
        this.menu = this.newMenu()
        this.menu.innerHTML =`
            <div id="choose-mark">
                <h1>Escoge tu marca:</h1>
                <h2>( las X comienzan )</h2>
                <div class="marks">
                    <div class="bot-start-btn x"></div>
                    <div class="bot-start-btn o"></div>
                </div>
            </div>`
        if(!document.getElementById('menu'))this.mountMenu()
        this.menu.addEventListener('click', (e) => {this.handler(e)} )
    }
    newRestartMenu(){
        this.menu = this.newMenu()
        this.menu.innerHTML =
            `<h1 id="finalMsg"></h1>
            <button class="restart-btn">Restart</button>`
        if(!document.getElementById('menu'))this.mountMenu()
        this.menu.addEventListener('click', (e) => {this.handler(e)} )
    }
    newRemoteMenu(message = false){
        this.menu = this.newMenu()
        this.menu.innerHTML =`
            <form id="form" class="remote-config">
                <div for="match-code">Partida Existente</div>
                <div class="existing-match">
                    <input name="match-code" id="existing-code" placeholder="Ingrese Codigo"></input>
                    <button for="existing-code" class="join btn">Unirse</button>
                </div>
                <div id="generated-code">${message?message:'O'}</div>
                <button class="new btn">Crear Partida</button>
            </form>`
        if(!document.getElementById('menu'))this.mountMenu()
        this.menu.addEventListener('click', this.handler )
        document.getElementById('form').addEventListener('submit', this.onSubmit )
    }
    newConnectingMenu(msg,loader,code = false){
        this.menu = this.newMenu()
        this.menu.innerHTML =`
            ${code? `
                <h1 id="code">${code}</h1>
                <button id="copyBtn" class="btn"></button>` 
            : ''}
            <h1 id="conMsg">${msg}</h1>
            ${loader? '<div class="loader"></div>':''}`
        if(!document.getElementById('menu'))this.mountMenu()
        this.menu.addEventListener('click', (e) => {this.handler(e)} )
        if(code)document.getElementById('copyBtn').addEventListener('click', () => {this.copyCode()})
    }
    copyCode(){ //not working
        const code = document.getElementById('code')
        const range = document.createRange();
        range.selectNode(code);
        const selection = window.getSelection().addRange(range);
        console.log(selection,code,range);
        document.execCommand('copy')
        document.getElementById('conMsg').innerText = 'Código copiado en el portapapeles'
    }
    setFinalMsg(text){
        if(document.getElementById('finalMsg')) document.getElementById('finalMsg').innerText = text
    }
    getMenu(){
        return this.menu
    }
    showMenu(){
        this.menu.classList.add('show')
    }
    hideMenu(){
        this.menu.classList.remove('show')
    }
    showRestart(text){        
        this.newRestartMenu()
        this.setFinalMsg(text)
        this.showMenu()
    }
    showBot(){
        this.newBotMenu()
        this.showMenu()
    }
    showRemote(message = false){
        this.newRemoteMenu(message)
        this.showMenu()
    }
    showConnecting(message,loader,code = false){
        this.newConnectingMenu(message,loader,code)
        this.showMenu()
    }
}


