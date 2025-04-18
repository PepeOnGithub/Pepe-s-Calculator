class MathParser {
    static operations = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b,
        '^': (a, b) => Math.pow(a, b)
    };

    static functions = {
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        log: Math.log10,
        sqrt: Math.sqrt,
        factorial: n => n <= 1 ? 1 : n * MathParser.functions.factorial(n - 1)
    };

    static constants = {
        π: Math.PI
    };

    static parse(expr, isDegree) {
        if (isDegree) {
            expr = expr.replace(/(sin|cos|tan)\(/g, '$1_deg(');
        }

        expr = expr.replace(/π/g, 'MathParser.constants.π');

        expr = expr.replace(/([a-z]+)_?deg?\(/g, (_, fn) => 
            `MathParser.functions.${fn}(`);

        expr = expr.replace(/(\d+)!/g, 'MathParser.functions.factorial($1)');

        if (!/^[\d+\-*\/^().π!a-z_]*$/.test(expr)) {
            throw new Error("Invalid characters in expression");
        }

        try {
            return Function(`"use strict"; return ${expr}`)();
        } catch (e) {
            throw new Error("Invalid math expression");
        }
    }
}

let input = '';
let isDegree = true;
let history = [];

function appendInput(value) {
    input += value;
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
    document.getElementById('result').value = input || '0';
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
        if (!input) return;

        const result = MathParser.parse(input, isDegree);
        history.push(`${input} = ${result}`);
        input = result.toString();
        updateDisplay();
    } catch (e) {
        alert(e.message);
        input = '';
        updateDisplay();
    }
}

function showHistory() {
    const historyDiv = document.querySelector('.calc-history');
    historyDiv.innerHTML = history.map(entry =>
        `<div class="history-entry">${entry}</div>`).join('');
    historyDiv.style.display = historyDiv.style.display === 'block' ? 'none' : 'block';
}

document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const icon = document.querySelector('#theme-toggle i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

document.addEventListener('keydown', (e) => {
    const allowedKeys = ['0','1','2','3','4','5','6','7','8','9','+','-','*','/','.','^','!','π'];
    if (allowedKeys.includes(e.key)) {
        appendInput(e.key);
    } else if (e.key === 'Enter') {
        calculate();
    } else if (e.key === 'Backspace') {
        backspace();
    } else if (e.key === 'Escape') {
        clearResult();
    }
});

const style = document.createElement('style');
style.textContent = `
    .history-entry {
        padding: 0.5rem;
        border-bottom: 1px solid var(--border);
        cursor: pointer;
    }
    .history-entry:hover {
        background: var(--primary);
    }
`;
document.head.appendChild(style);

document.querySelector('.calc-history').addEventListener('click', (e) => {
    if (e.target.classList.contains('history-entry')) {
        const expr = e.target.textContent.split('=')[0].trim();
        input = expr;
        updateDisplay();
    }
});
