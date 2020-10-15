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
    newRemoteMenu(){
        this.menu = this.newMenu()
        this.menu.innerHTML =`
            <form id="form" class="remote-config">
                <button class="new btn">Crear Partida</button>
                <div id="generated-code">O</div>
                <div for="match-code">Partida Existente</div>
                <div class="existing-match">
                    <input name="match-code" id="existing-code" placeholder="Ingrese Codigo"></input>
                    <button class="join btn">Unirse</button>
                </div>
            </form>`
        if(!document.getElementById('menu'))this.mountMenu()
        this.menu.addEventListener('click', this.handler )
        document.getElementById('form').addEventListener('submit', this.onSubmit )
    }
    newConnectingMenu(msg,code = false){
        this.menu = this.newMenu()
        this.menu.innerHTML =`
            ${code? `
                <h1 id="code">${code}</h1>
                <button id="copyBtn"></button>` 
            : ''}
            <h1 id="ConMsg">${msg}</h1>
            <div class="loader"></div>`
        if(!document.getElementById('menu'))this.mountMenu()
        this.menu.addEventListener('click', (e) => {this.handler(e)} )
        document.getElementById('copyBtn').addEventListener('click', () => {this.copyCode()})
    }
    copyCode(){
        const code = document.getElementById('code')
        const range = document.createRange();
        range.selectNode(code);
        window.getSelection().addRange(range);
        document.execCommand('copy')
        document.getElementById('ConMsg').innerText('Código copiado en el portapapeles')
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
    showRemote(){
        this.newRemoteMenu()
        this.showMenu()
    }
}


