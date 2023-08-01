const canvasEl = document.querySelector('canvas'),
    canvasCt = canvasEl.getContext('2d')

const teclado = {key: 0}


//objeto campo
const campo = {
    altura: window.innerHeight,
    largura: window.innerWidth,

    desenho: function () {
        //campo
        canvasCt.fillStyle = 'darkorange'
        canvasCt.fillRect(0, 0, this.largura, this.altura)
    },
}

//objeto linha
const linha = {
    altura: campo.altura,
    largura: 10,

    desenho: function () {
        canvasCt.fillStyle = 'white'
        canvasCt.fillRect(campo.largura / 2 - this.largura, 0, this.largura, this.altura)
    },
}

//objeto raquetes
const raqueteEsq = {
    x: 10,
    y: campo.altura/2,
    altura: 150,
    largura: linha.largura,

    _movimentacao: function(){
        if (teclado.key === 'w'){
            this.y -= 10
        }
        if (teclado.key === 's'){
            this.y += 10
        }
    },

    desenho: function () {
        canvasCt.fillStyle = 'white'
        canvasCt.fillRect(this.x, this.y, this.largura, this.altura)

        this._movimentacao()
    }
}

const raqueteDir = {
    x: campo.largura - (linha.largura + raqueteEsq.x),
    y: campo.altura/2 - raqueteEsq.altura,
    altura: raqueteEsq.altura,
    largura: linha.largura,
    velocidade: 3,

    _movimentacao: function (){
        console.log(teclado.key)
        if (teclado.key === 'ArrowUp'){
            this.y -= 10
        }
        if (teclado.key === 'ArrowDown'){
            this.y += 10
        }
    },

    desenho: function () {
        canvasCt.fillStyle = 'white'
        canvasCt.fillRect(this.x, this.y, this.largura, this.altura)

        this._movimentacao()
    }
}

//objeto placar
const placar = {
    player1: 0,
    player2: 0,

    desenho: function () {
        canvasCt.font = 'bold 50px Arial'
        canvasCt.textAlign = 'center'
        canvasCt.textBaseline = 'top'
        canvasCt.fillStyle = 'white'
        canvasCt.fillText(this.player1, campo.largura / 4, 10)
        canvasCt.fillText(this.player2, campo.largura / 4 + campo.largura / 2, 10)
    }
}

//objeto bola
const bolinha = {
    x: campo.largura/2,
    y: campo.altura/2,
    raio: 15,
    velocidade: 10,
    direcaoX: 1,
    direcaoY: 1,

    _calcPosicao: function(){
        //impede a bolinha de sair do campo
        if ((this.y > campo.altura - this.raio && this.direcaoY > 0) || this.y < 0 + this.raio && this.direcaoY < 0){
            this.direcaoY *= -1
        }
        
        //verifica se o jogador 1 esta fazendo o ponto
        if (this.x > campo.largura - this.raio - raqueteDir.largura - 10){
            //verifica se a bola vai bater na raquete direita
            if (this.y + this.raio > raqueteDir.y && this.y - this.raio < raqueteDir.y + raqueteDir.altura){
                this.direcaoX *= -1
            }
            //pontua jogador 1 
            else { 
                placar.player1++
                this._restartGame()
            }
        }

        //verifica se o jogador 2 esta fazendo o ponto
        if(this.x < 0 + this.raio + raqueteDir.largura + 10){
            if(this.y + this.raio > raqueteEsq.y && this.y - this.raio < raqueteEsq.y + raqueteEsq.altura){
                this.direcaoX *= -1
            }
            else{
                placar.player2++
                this._restartGame()
            }
        }
    },

    _restartGame: function(){
        bolinha.x = campo.largura/2
        bolinha.y = campo.altura/2
    },

    _movimentacao: function () {
        this.x += this.direcaoX * this.velocidade
        this.y += this.direcaoY * this.velocidade

    },

    desenho: function () {
        canvasCt.fillStyle = 'white'
        canvasCt.beginPath()
        canvasCt.arc(this.x, this.y, this.raio, 0, Math.PI * 2, false)
        canvasCt.fill()

        this._calcPosicao()
        this._movimentacao()
    }
}


function setup() {
    canvasEl.width = campo.largura
    canvasEl.height = campo.altura
    canvasCt.width = campo.largura
    canvasCt.height = campo.altura
}

function desenho() {
    campo.desenho()
    linha.desenho()
    raqueteEsq.desenho()
    raqueteDir.desenho()
    placar.desenho()
    bolinha.desenho()
}

setup()
desenho()

window.animateFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60)
        }
    )
})()


function main() {
    animateFrame(main)
    desenho()
}

setup()
main()

document.addEventListener('keydown', function(event){
    teclado.key = event.key
})

document.addEventListener('keyup', function(event){
    teclado.key = 0
})
