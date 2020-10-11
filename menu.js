class Menu{
    constructor(game){
        this.game = game
        this.menu = newMenu()
    }
    newMenu(){
        return document.createElement('div')
    }
    newBotMenu(){
        const message = document.createElement('h1')
        message.innerText = 'Escoje tu Marca:'
        const explanation = document.createElement('h2')
        explanation.innerText = '( las X comienzan )'


    }
    getMenu(){
        return this.menu
    }
}
/*
<div id="choose-mark">
    <h1>Escoge tu marca:</h1>
    <h2>( las X comienzan )</h2>
    <div class="marks">
        <div class="bot-start-btn x"></div>
        <div class="bot-start-btn o"></div>
    </div>
</div>
*/
/*
<div class="final-message">
    <h1></h1>
    <button class="restart-btn">Restart</button>
</div> 
*/
/*
<form action="" class="remote-config">
    <button class="btn new">Crear Partida</button>
    <div id="generated-code">O</div>
    <div for="match-code">Partida Existente</div>
    <div class="existing-match">
        <input name="match-code" id="existing-code" placeholder="Ingrese Codigo"></input>
        <button class="btn join">Unirse</button>
    </div>
</form>
*/

