let input = '';

function appendInput(value) {
  input += value;
  updateResult();
}

function clearResult() {
  input = '';
  updateResult();
}

function backspace() {
  input = input.slice(0, -1);
  updateResult();
}

function updateResult() {
  document.getElementById('result').value = input;
}

function calculate() {
  try {
    let result;
    if (input.endsWith('%')) {
      result = eval(input.slice(0, -1)) / 100;
    } else {
      result = eval(input);
    }
    input = result.toString();
    updateResult();
  } catch (e) {
    alert('Error: ' + e.message);
  }
}
