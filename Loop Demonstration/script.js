// Get loop containers
const loop1Div = document.getElementById('loop1');
const loop2Div = document.getElementById('loop2');
const loop3Div = document.getElementById('loop3');

// Reset function for any loop
let total = 0;
function resetLoop(id) {
    document.getElementById(id).innerHTML = '';
    if (id === 'loop2') total = 0;
}

// --------------------
// For Loop
// --------------------
async function startForLoop() {
    resetLoop('loop1');
    for (let i = 1; i <= 10; i++) {
        const item = document.createElement('div');
        item.className = 'loop-item';
        item.textContent = i;
        loop1Div.appendChild(item);
        await new Promise(resolve => setTimeout(resolve, 300));
    }
}

// --------------------
// While Loop (fixed)
// --------------------
async function startWhileLoop() {
    resetLoop('loop2');
    total = 0;

    while (total < 30) {
        const randomNum = Math.floor(Math.random() * 10) + 1;

        // Skip if adding would exceed 30
        if (total + randomNum > 30) {
            await new Promise(resolve => setTimeout(resolve, 300));
            continue;
        }

        total += randomNum;

        const item = document.createElement('div');
        item.className = 'loop-item';
        item.innerHTML = `<strong>+${randomNum}</strong><br><small>Total: ${total}</small>`;
        loop2Div.appendChild(item);

        await new Promise(resolve => setTimeout(resolve, 300));
    }
}

// --------------------
// Color Loop
// --------------------
const colors = ['red', 'green', 'blue', 'orange', 'purple', 'yellow', 'pink'];

async function startColorLoop() {
    resetLoop('loop3');
    for (const color of colors) {
        const colorBox = document.createElement('div');
        colorBox.className = 'loop-item';
        colorBox.textContent = color;
        colorBox.style.backgroundColor = color;
        colorBox.style.color = ['yellow', 'pink'].includes(color) ? 'black' : 'white';
        loop3Div.appendChild(colorBox);
        await new Promise(resolve => setTimeout(resolve, 300));
    }
}
