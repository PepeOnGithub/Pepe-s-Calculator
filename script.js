// script.js
let input = '';
let isDegree = true;
let history = [];

function appendInput(value) {
    if (value === 'π') input += Math.PI;
    else input += value;
    updateDisplay();
}

function handleScientific(func) {
    input += func;
    updateDisplay();
}

function toggleDegrees() {
    isDegree = !isDegree;
    document.getElementById('deg-rad').textContent = isDegree ? 'DEG' : 'RAD';
}

function updateDisplay() {
    document.getElementById('result').value = input;
    document.getElementById('expression').textContent = input;
}

function clearResult() {
    input = '';
    updateDisplay();
}

function backspace() {
    input = input.slice(0, -1);
    updateDisplay();
}

function calculate() {
    try {
        let expression = input
            .replace(/sin\(/g, isDegree ? 'Math.sin(Math.PI/180*' : 'Math.sin(')
            .replace(/cos\(/g, isDegree ? 'Math.cos(Math.PI/180*' : 'Math.cos(')
            .replace(/tan\(/g, isDegree ? 'Math.tan(Math.PI/180*' : 'Math.tan(')
            .replace(/(\d+)!/g, (_, n) => `factorial(${n})`)
            .replace(/\^/g, '**');

        const factorial = (n) => n <= 1 ? 1 : n * factorial(n - 1);
        const result = Function(`'use strict'; return (${expression})`)()();
        
        history.push(`${input} = ${result}`);
        input = result.toString();
        updateDisplay();
    } catch (e) {
        alert('Error: Invalid expression');
        console.error(e);
    }
}

function showHistory() {
    const historyDiv = document.querySelector('.calc-history');
    historyDiv.innerHTML = history.join('<br>');
    historyDiv.style.display = historyDiv.style.display === 'block' ? 'none' : 'block';
}

// Theme toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const icon = document.querySelector('#theme-toggle i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9' || ['+', '-', '*', '/', '.'].includes(e.key)) {
        appendInput(e.key);
    } else if (e.key === 'Enter') {
        calculate();
    } else if (e.key === 'Backspace') {
        backspace();
    } else if (e.key === 'Escape') {
        clearResult();
    }
});
