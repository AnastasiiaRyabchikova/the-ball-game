const gameField = document.querySelector('.game-field');
const gameFieldSizes = {width: gameField.clientWidth, height: gameField.clientHeight};


console.log(gameFieldSizes);
const ball = document.querySelector('.ball');
ballSizes = {width: ball.clientWidth, height: ball.clientHeight};

console.log(ball);
ball.style.top = `${gameFieldSizes.height * 0.7 - ballSizes.height}px`;

const boxTemplate = document.createElement('div');
boxTemplate.classList.add('box');


function initBox() {
    const box = boxTemplate.cloneNode();
    box.style.left = `${gameFieldSizes.width}px` ;
    gameField.appendChild(box);
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
            if (x < gameFieldSizes.width/2 + ballSizes.width/2 && x > gameFieldSizes.width/2 - ballSizes.width/2 - box.clientWidth) {
                box.style.background = "orange";
                console.log('111');
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
        console.log('1111');
        let top = parseInt(ball.style.top);
        console.log(top);
        ball.style.transition = 'top 1.1s cubic-bezier(.18,.48,.33,1.01)';
        ball.style.top = `${top - ballSizes.height * 3}px`;
        ball.addEventListener('transitionend', function(evt) {
            console.log(evt);
            ball.style.transition = 'top 1.1s cubic-bezier(.65,.04,.79,.57)';
            evt.target.style.top = `${gameFieldSizes.height * 0.7 - ballSizes.height}px`;
        });
    }
});

initAppearingBoxes()