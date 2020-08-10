function getRandom(min, max) {
    return Math.floor(Math.random() * (max-min) + min);
}


const field = document.querySelector('.game-field');
const fieldSizes = {width: field.clientWidth, height: field.clientHeight};
const button = document.querySelector('.button');

class Ball {
    constructor(elem) {
        this.elem = elem;
        this.width = elem.clientWidth;
        this.height = elem.clientHeight;
        this.top = fieldSizes.height * 0.7 - this.height
    }
    set top(value) {
        this.elem.style.top = `${value}px`;
        this._top = value;
    }

    get top() {
        return this._top;
    }

    jump() {
        let top = this.top;
        this.elem.style.transition = 'top 1.1s cubic-bezier(.18,.48,.33,1.01)';
        this.top = top - this.height * 3;
        this.elem.addEventListener('transitionend', (evt) => {
            this.elem.style.transition = 'top 1.1s cubic-bezier(.65,.04,.79,.57)';
            this.top = fieldSizes.height * 0.7 - this.height;
        });
    }
}

class Box {
    constructor() {
        this.elem = this.getElem();
        this.left = fieldSizes.width;
        field.appendChild(this.elem);
        this.initBoxAnimation();
        this.width = this.elem.clientWidth;
        this.height = this.elem.clientHeight;
    }

    getElem() {
        const box = document.createElement('div');
        box.classList.add('box');
        return box;
    }

    initBoxAnimation() {
        let animationStart = performance.now();

        const animate = (time) => {
            if ( time > animationStart + 2 ) {
                let x = this.left - 1;
                if ( game.validateGameLost(x, this) ) {
                    cancelAnimationFrame(this.requestId);
                    game.gameOver();
                    return
                } 

                this.left = x;

                if (x <= -50) {
                    cancelAnimationFrame(this.requestId);
                    game.boxes.shift();
                    return;
                }
                animationStart = time;
            }   
            this.requestId = requestAnimationFrame(animate);

        }

        this.requestId = requestAnimationFrame(animate);
    }

    set left(value) {
        this.elem.style.left = `${value}px`;
        this._left = value;
    }

    get left() {
        return this._left;
    }
}


class Game {
    constructor() {
        this.boxes = [];
        this.isLost = false;
        this.ball = new Ball(document.querySelector('.ball'));
        this._addKeyDownListener();
        this.gap = getRandom(4000, 10000);

    }

    _addKeyDownListener() {
        document.addEventListener('keydown', (evt) => {
            if (evt.keyCode === 38) {
                this.ball.jump();
            }
        });        
    }

    gameOver() {
        this.boxes.forEach(box => cancelAnimationFrame(box.requestId));
        cancelAnimationFrame(this.initRequestId);
        this.isLost = true;
        field.classList.add('lost');
    }

    validateGameLost = (x, box) => {
        return x < fieldSizes.width/2 + this.ball.width/2 
        && x > fieldSizes.width/2 - box.width
        && this.ball.elem.offsetTop >= Math.floor(fieldSizes.height * 0.7 - box.height * 2 );
    }
    
    startGame() {
        if ( button.innerHTML === 'Start' ) button.innerHTML = 'Restart';
        if ( field.classList.contains('lost') ) field.classList.remove('lost');
        if ( this.boxes.length ) this.boxes.forEach(({elem}) => field.removeChild(elem));
        this.boxes.length = 0;
        this.isLost = false;
        this.initAppearingBoxes();
    }

    initAppearingBoxes() {
        this.boxes.push(new Box());
        let animationStart = performance.now();

        const animate = (time) => {
            if ( this.isLost ) return;
            if ( time > animationStart + this.gap ) {
                this.boxes.push( new Box() );
                this.gap = getRandom( 4000, 10000 );
                animationStart = time;
            }   
            this.initRequestId = requestAnimationFrame( animate );
        }


        this.initRequestId = requestAnimationFrame( animate );
    }
}


const game = new Game();



button.addEventListener('click', () => game.startGame());