let input = '';
let memory = 0;
let isDegree = true;
let theme = 'dark';
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

function updateHistory() {
    const historyElement = document.getElementById('history');
    historyElement.innerHTML = history.slice(-3).join('<br>');
}

function appendInput(value) {
    if (input === '0' && !isNaN(value)) input = '';
    input += value;
    updateResult();
}

function clearResult() {
    input = '0';
    updateResult();
}

function backspace() {
    input = input.slice(0, -1);
    if (input === '') input = '0';
    updateResult();
}

function updateResult() {
    document.getElementById('result').value = input;
}

function handleScientific(func) {
    appendInput(func + '(');
}

function handleParenthesis() {
    const open = (input.match(/\(/g) || []).length;
    const close = (input.match(/\)/g) || []).length;
    appendInput(open > close ? ')' : '(');
}

function toggleAngleUnit() {
    isDegree = !isDegree;
    document.querySelector('.button.special:nth-last-child(1)').textContent = isDegree ? 'DEG' : 'RAD';
}

function memoryAdd() {
    memory += parseFloat(evaluateExpression(input));
}

function memorySubtract() {
    memory -= parseFloat(evaluateExpression(input));
}

function memoryClear() {
    memory = 0;
}

function memoryRecall() {
    appendInput(memory.toString());
}

function evaluateExpression(expr) {
    expr = expr
        .replace(/π/g, Math.PI)
        .replace(/e/g, Math.E)
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/sin\(/g, isDegree ? 'Math.sin(Math.PI/180*' : 'Math.sin(')
        .replace(/cos\(/g, isDegree ? 'Math.cos(Math.PI/180*' : 'Math.cos(')
        .replace(/tan\(/g, isDegree ? 'Math.tan(Math.PI/180*' : 'Math.tan(')
        .replace(/\^/g, '**')
        .replace(/!/g, factorial);
    
    return Function(`'use strict'; return (${expr})`)();
}

function factorial(n) {
    n = parseInt(n);
    return n <= 1 ? 1 : n * factorial(n - 1);
}

function calculate() {
    try {
        const result = evaluateExpression(input);
        history.push(`${input} = ${result}`);
        if (history.length > 10) history.shift();
        localStorage.setItem('calcHistory', JSON.stringify(history));
        
        input = result.toString();
        updateResult();
        updateHistory();
    } catch (e) {
        alert('Invalid expression');
        clearResult();
    }
}

function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.body.classList.toggle('light-theme');
    const themeBtn = document.querySelector('.button.special:nth-last-child(2)');
    themeBtn.innerHTML = theme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key >= '0' && key <= '9' || key === '.') appendInput(key);
    if (['+', '-', '*', '/'].includes(key)) appendInput(key);
    if (key === 'Enter') calculate();
    if (key === 'Backspace') backspace();
    if (key === 'Escape') clearResult();
});

// Initialize
updateHistory();
