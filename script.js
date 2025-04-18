class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.history = document.getElementById('history');
        this.memory = 0;
        this.currentInput = '0';
        this.operation = null;
        this.prevValue = 0;
        this.init();
    }

    init() {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', () => this.handleButton(button));
        });
        
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        this.updateDisplay();
    }

    handleButton(button) {
        const type = button.classList[1];
        const value = button.dataset.op || button.dataset.num;

        switch(type) {
            case 'num': this.handleNumber(value); break;
            case 'op': this.handleOperator(value); break;
            case 'sci': this.handleScientific(value); break;
            case 'mem': this.handleMemory(value); break;
            case 'clr': this.handleClear(value); break;
            case 'eq': this.calculate(); break;
        }
    }

    handleNumber(num) {
        if (this.currentInput === '0') this.currentInput = '';
        if (num === '.' && this.currentInput.includes('.')) return;
        this.currentInput += num;
        this.updateDisplay();
    }

    handleOperator(op) {
        switch(op) {
            case '±': 
                this.currentInput = (-parseFloat(this.currentInput)).toString();
                break;
            case '1/x':
                this.currentInput = (1 / parseFloat(this.currentInput)).toString();
                break;
            case 'x²':
                this.currentInput = Math.pow(parseFloat(this.currentInput), 2).toString();
                break;
            case '%':
                this.currentInput = (parseFloat(this.currentInput) / 100).toString();
                break;
            default:
                this.prevValue = parseFloat(this.currentInput);
                this.operation = op;
                this.currentInput = '0';
        }
        this.updateDisplay();
    }

    handleScientific(func) {
        this.currentInput = `${func}${this.currentInput})`;
        this.updateDisplay();
    }

    handleMemory(op) {
        const value = parseFloat(this.currentInput);
        switch(op) {
            case 'MC': this.memory = 0; break;
            case 'MR': this.currentInput = this.memory.toString(); break;
            case 'M+': this.memory += value; break;
            case 'M-': this.memory -= value; break;
            case 'MS': this.memory = value; break;
        }
        this.updateDisplay();
    }

    handleClear(op) {
        switch(op) {
            case 'C': 
                this.currentInput = '0';
                this.prevValue = 0;
                this.operation = null;
                break;
            case 'CE': 
                this.currentInput = '0';
                break;
            case '⌫': 
                this.currentInput = this.currentInput.slice(0, -1);
                if (this.currentInput === '') this.currentInput = '0';
                break;
        }
        this.updateDisplay();
    }

    calculate() {
        if (!this.operation) return;
        
        const current = parseFloat(this.currentInput);
        let result;
        
        switch(this.operation) {
            case '+': result = this.prevValue + current; break;
            case '-': result = this.prevValue - current; break;
            case '×': result = this.prevValue * current; break;
            case '÷': result = this.prevValue / current; break;
        }

        this.history.textContent = `${this.prevValue} ${this.operation} ${current} = ${result}`;
        this.currentInput = result.toString();
        this.operation = null;
        this.updateDisplay();
    }

    updateDisplay() {
        this.display.value = this.currentInput.replace(/\*/g, '×').replace(/\//g, '÷');
    }

    handleKeyboard(e) {
        e.preventDefault();
        const key = e.key;
        
        if (key >= '0' && key <= '9' || key === '.') this.handleNumber(key);
        if (['+', '-', '*', '/'].includes(key)) this.handleOperator(
            key === '*' ? '×' : key === '/' ? '÷' : key
        );
        if (key === 'Enter') this.calculate();
        if (key === 'Backspace') this.handleClear('⌫');
        if (key === 'Escape') this.handleClear('C');
    }
}

// Initialize Calculator
const calculator = new Calculator();

// Theme Management
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const themeBtn = document.querySelector('.theme-toggle i');
    themeBtn.classList.toggle('fa-moon');
    themeBtn.classList.toggle('fa-sun');
    
    // Save theme preference
    const isDark = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', isDark);
}

// Initialize Theme
document.body.classList.toggle('light-theme', 
    localStorage.getItem('theme') === 'light'
);
document.querySelector('.theme-toggle i').classList.toggle('fa-sun',
    localStorage.getItem('theme') === 'light'
);
