class Menu{
    constructor(game,option,handler){
        this.game = game
        this.menu = this.newMenu()
        this.option = option
        this.handler = handler
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
        this.menu.innerHTML =
        `<div id="choose-mark">
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
        this.menu.innerHTML =
        `<form action="" class="remote-config">
        <button class="new btn">Crear Partida</button>
        <div id="generated-code">O</div>
        <div for="match-code">Partida Existente</div>
        <div class="existing-match">
        <input name="match-code" id="existing-code" placeholder="Ingrese Codigo"></input>
        <button class="join btn">Unirse</button>
        </div>
        </form>`
        if(!document.getElementById('menu'))this.mountMenu()
        this.menu.addEventListener('click', (e) => {this.handler(e)} )
        document.querySelector('.remote-config').addEventListener('submit', event =>{handleSubmit(event)} )
    }
    handleSubmit(event){
        event.preventDefault()
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


