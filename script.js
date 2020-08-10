const field = document.querySelector('.game-field');
const fieldSizes = {width: field.clientWidth, height: field.clientHeight};
const button = document.querySelector('.button');

class Ball {
    constructor(elem) {
        this.elem = elem;
        this.width = elem.clientWidth;
        this.height = elem.clientHeight;
    }
    set top(value) {
        this.elem.style.top = `${value}px`;
        this._top = value;
    }

    get top() {
        return this._top;
    }

    jump() {

        // this.direction = "toTop";

        // let animationStart = performance.now();
        // let animationDuration;

        // let gap = 1;

        // const animate = (time) => {
            // animationDuration = time - animationStart;

            // if ( time > animationStart + gap ) {

                // if ( this.top > fieldSizes.height * 0.7 - this.height * 3 && this.direction === "toTop") {

                    // let x = this.top - 1;
                    // this.top = x;
                    // 
                // } else if (this.top < fieldSizes.height * 0.7 - this.height) {
                    // this.direction = "toBottom"
                    // let x = this.top + 1;
                    // this.top = x;
                // } else {
                    // cancelAnimationFrame(this.requestId);
                    // this.direction = ""
                    // return;
                // }

                // animationStart = time;
            // }   

            // this.requestId = requestAnimationFrame(animate);


            let top = ball.top;
            this.elem.style.transition = 'top 1.1s cubic-bezier(.18,.48,.33,1.01)';
            this.top = top - this.height * 3;
            this.elem.addEventListener('transitionend', (evt) => {
                this.elem.style.transition = 'top 1.1s cubic-bezier(.65,.04,.79,.57)';
                this.top = fieldSizes.height * 0.7 - this.height;
            });
    

        // }

        // this.requestId = requestAnimationFrame(animate);
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
                if ( validateGameLost(x, this) ) {
                    this.elem.style.background = "orange";
                    cancelAnimationFrame(this.requestId);
                    gameOver();
                    return
                } else {
                    this.elem.style.background = "";
                }

                this.left = x;

                if (x <= -50) {
                    cancelAnimationFrame(this.requestId);
                    boxes.shift();
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

const ball = new Ball(document.querySelector('.ball'));


ball.top = fieldSizes.height * 0.7 - ball.height;

function getRandom(min, max) {
    return Math.floor(Math.random() * (max-min) + min);
}

let gap = getRandom(4000, 10000);

let boxes = [];
let initRequestId;
let isLost = false;

function initAppearingBoxes() {
    boxes.push(new Box());
    let animationStart = performance.now();
    let initRequestId = requestAnimationFrame(function animate(time) {
        if (isLost) return;
        if ( time > animationStart + gap ) {
            boxes.push(new Box());
            gap = getRandom(4000, 10000);
            animationStart = time;
        }   
        initRequestId = requestAnimationFrame(animate);
    });
}

document.addEventListener('keydown', function(evt) {
    if (evt.keyCode === 38) {
        ball.jump();
    }
});

function gameOver() {

    boxes.forEach(box => cancelAnimationFrame(box.requestId));
    cancelAnimationFrame(initRequestId);
    isLost = true;

    field.classList.add('lost');
}

const validateGameLost = (x, box) => {
    return x < fieldSizes.width/2 + ball.width/2 
    && x > fieldSizes.width/2 - box.width
    && ball.elem.offsetTop >= Math.floor(fieldSizes.height * 0.7 - box.height * 2 );
}

function startGame() {
    if ( button.innerHTML === 'Start' ) button.innerHTML = 'Restart';
    if ( field.classList.contains('lost') ) field.classList.remove('lost')
    if (boxes.length) boxes.forEach(({elem}) => {
        field.removeChild(elem);
    });
    boxes.length = 0;
    initAppearingBoxes();

}



button.addEventListener('click', startGame);