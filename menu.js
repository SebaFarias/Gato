class menu{
    constructor(game){
        this.game = game
        this.menu = newMenu()
    }
    newMenu(){
        return document.createElement('div')
    }
}