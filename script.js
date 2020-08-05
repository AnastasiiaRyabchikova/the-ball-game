const gameField = document.querySelector('.game-field');
const gameFieldSizes = gameField.getBoundingClientRect();

const box = document.createElement('div');
box.classList.add('box');

box.style.left = `${gameFieldSizes.width}px` ;

gameField.appendChild(box);

function initBoxAnimation() {
    let animationStart = performance.now();
    let requestId = requestAnimationFrame(function animate(time) {
        if ( time > animationStart + 2 ) {
            let x = parseInt(box.style.left) - 1;
            box.style.left = `${x}px`;
            if (x <= -50) {
                cancelAnimationFrame(requestId);
                return;
            }
            animationStart = time;
        }   
        requestId = requestAnimationFrame(animate);
    });
}

initBoxAnimation();