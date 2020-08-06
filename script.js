const field = document.querySelector('.game-field');
const fieldSizes = {width: field.clientWidth, height: field.clientHeight};

class Ball {
    constructor(elem) {
        this.elem = elem;
        this.width = elem.clientWidth
        this.height = elem.clientHeight
        
    }
    set top(value) {
        this.elem.style.top = `${value}px`;
        this._top = value;
    }

    get top() {
        return this._top;
    }
}

const ball = new Ball(document.querySelector('.ball'));

ball.top = fieldSizes.height * 0.7 - ball.height;

const boxTemplate = document.createElement('div');
boxTemplate.classList.add('box');


function initBox() {
    const box = boxTemplate.cloneNode();
    box.style.left = `${fieldSizes.width}px` ;
    field.appendChild(box);
    initBoxAnimation(box);
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max-min) + min);
}

function initBoxAnimation(box) {
    let animationStart = performance.now();
    let requestId = requestAnimationFrame(function animate(time) {
        if ( time > animationStart + 2 ) {
            let x = parseInt(box.style.left) - 1;
            box.style.left = `${x}px`;
            if (x < fieldSizes.width/2 + ball.width/2 && x > fieldSizes.width/2 - ball.width/2 - box.clientWidth) {
                box.style.background = "orange";
            } else {
                box.style.background = "";
            }
            if (x <= -50) {
                cancelAnimationFrame(requestId);
                box.remove();
                box = null;
                return;
            }
            animationStart = time;
        }   
        requestId = requestAnimationFrame(animate);
    });
}

let gap = getRandom(4000, 10000);

function initAppearingBoxes() {
    initBox();
    let animationStart = performance.now();
    let requestId = requestAnimationFrame(function animate(time) {
        if ( time > animationStart + gap ) {
            initBox();
            gap = getRandom(4000, 10000)
            animationStart = time;
        }   
        requestId = requestAnimationFrame(animate);
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

initAppearingBoxes()