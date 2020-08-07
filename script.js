const field = document.querySelector('.game-field');
const fieldSizes = {width: field.clientWidth, height: field.clientHeight};

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
                console.log(validate(x, this));
                if ( validate(x, this) ) {
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

const boxes = [];
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
        let top = parseInt(ball.top);
        ball.elem.style.transition = 'top 1.1s cubic-bezier(.18,.48,.33,1.01)';
        ball.top = top - ball.height * 3;
        ball.elem.addEventListener('transitionend', function(evt) {
            ball.elem.style.transition = 'top 1.1s cubic-bezier(.65,.04,.79,.57)';
            ball.top = fieldSizes.height * 0.7 - ball.height;
        });
    }
});

initAppearingBoxes();

function gameOver() {

    boxes.forEach(box => cancelAnimationFrame(box.requestId));
    cancelAnimationFrame(initRequestId);
    isLost = true;

    field.classList.add('lost');
}

const validate = (x, box) => {
    return x < fieldSizes.width/2 + ball.width/2 
    && x > fieldSizes.width/2 
    && ball.top >= fieldSizes.height * 0.7 - box.height;
}

