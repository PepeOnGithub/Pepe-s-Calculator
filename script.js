let input = '0';
let memory = 0;
let isDegree = true;
let currentTheme = localStorage.getItem('theme') || 'dark';
let currentMode = 'basic';
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];
let conversionRates = {
    'cm-inches': value => value / 2.54,
    'inches-cm': value => value * 2.54,
    'kg-lbs': value => value * 2.20462,
    'lbs-kg': value => value / 2.20462,
    'c-f': value => (value * 9/5) + 32,
    'f-c': value => (value - 32) * 5/9
};

// Initialize theme
document.documentElement.setAttribute('data-theme', currentTheme);
document.querySelector('.theme-toggle i').className = 
    currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

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
    document.querySelector('.button.operator:nth-last-child(1)').textContent = 
        isDegree ? 'DEG' : 'RAD';
}

function handleConversion(conversionType) {
    const value = parseFloat(input);
    const result = conversionRates[conversionType](value);
    document.getElementById('conversionResult').textContent = 
        `${value} => ${result.toFixed(2)}`;
    history.push(`${conversionType}: ${value} → ${result.toFixed(2)}`);
    localStorage.setItem('calcHistory', JSON.stringify(history));
    updateHistory();
}

function handleBitwise(operation) {
    const value = parseInt(input, 10);
    let secondValue, result;
    
    try {
        switch(operation) {
            case 'AND':
                secondValue = parseInt(prompt('Enter second number:'));
                result = value & secondValue;
                break;
            case 'OR':
                secondValue = parseInt(prompt('Enter second number:'));
                result = value | secondValue;
                break;
            case 'XOR':
                secondValue = parseInt(prompt('Enter second number:'));
                result = value ^ secondValue;
                break;
            case 'NOT':
                result = ~value;
                break;
        }
        input = result.toString();
        updateResult();
    } catch {
        alert('Invalid input for bitwise operation');
    }
}

function handleProgramming(mode) {
    const value = parseInt(input, 10);
    try {
        if (mode === 'DEC') input = value.toString(10);
        if (mode === 'HEX') input = value.toString(16).toUpperCase();
        if (mode === 'BIN') input = value.toString(2);
        updateResult();
    } catch {
        alert('Invalid conversion');
    }
}

function memoryAdd() {
    memory += parseFloat(input);
}

function memorySubtract() {
    memory -= parseFloat(input);
}

function memoryClear() {
    memory = 0;
}

function memoryRecall() {
    input = memory.toString();
    updateResult();
}

function evaluateExpression(expr) {
    return Function('"use strict";return (' + expr
        .replace(/π/g, Math.PI)
        .replace(/e/g, Math.E)
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/sin\(/g, isDegree ? 'Math.sin(Math.PI/180*' : 'Math.sin(')
        .replace(/cos\(/g, isDegree ? 'Math.cos(Math.PI/180*' : 'Math.cos(')
        .replace(/tan\(/g, isDegree ? 'Math.tan(Math.PI/180*' : 'Math.tan(')
        .replace(/\^/g, '**')
        .replace(/!/g, function factorial(n) {
            return n <= 1 ? 1 : n * factorial(n - 1);
        }) + ')')();
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
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    document.querySelector('.theme-toggle i').className = 
        currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

function switchMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.keys').forEach(el => el.style.display = 'none');
    document.querySelector(`.${mode}-mode`).style.display = 'grid';
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.tab[onclick="switchMode('${mode}')"]`).classList.add('active');
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
