const display = document.getElementById('display');
const clearButton = document.getElementById('clear');
const backspaceButton = document.getElementById('backspace');
const equalsButton = document.getElementById('equals');
const decimalButton = document.getElementById('decimal');
const digitButtons = document.querySelectorAll('[data-digit]');
const operatorButtons = document.querySelectorAll('[data-operator]');

let firstValue = null;
let secondValue = null;
let currentOperator = null;
let shouldResetDisplay = false;
let lastActionWasEquals = false;

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    return 'Can’t divide by 0.';
  }
  return a / b;
}

function operate(operator, a, b) {
  const x = Number(a);
  const y = Number(b);

  switch (operator) {
    case '+':
      return add(x, y);
    case '-':
      return subtract(x, y);
    case '*':
      return multiply(x, y);
    case '/':
      return divide(x, y);
    default:
      return y;
  }
}

function updateDisplay(value) {
  display.textContent = String(value);
}

function resetCalculator() {
  firstValue = null;
  secondValue = null;
  currentOperator = null;
  shouldResetDisplay = false;
  lastActionWasEquals = false;
  updateDisplay('0');
  decimalButton.disabled = false;
}

function clearDisplayIfNeeded() {
  if (display.textContent === '0' || shouldResetDisplay || isErrorMessage(display.textContent)) {
    updateDisplay('');
    decimalButton.disabled = false;
  }
  shouldResetDisplay = false;
  lastActionWasEquals = false;
}

function appendDigit(digit) {
  clearDisplayIfNeeded();

  if (display.textContent.length >= 16) {
    return;
  }

  if (display.textContent === '0') {
    updateDisplay(digit);
  } else {
    updateDisplay(display.textContent + digit);
  }

  if (display.textContent.includes('.')) {
    decimalButton.disabled = true;
  }
}

function appendDecimal() {
  if (shouldResetDisplay || lastActionWasEquals || isErrorMessage(display.textContent)) {
    updateDisplay('0');
    shouldResetDisplay = false;
    lastActionWasEquals = false;
  }

  if (display.textContent.includes('.')) {
    return;
  }

  updateDisplay(display.textContent + '.');
  decimalButton.disabled = true;
}

function isErrorMessage(value) {
  return typeof value === 'string' && value.includes('divide');
}

function roundResult(value) {
  if (typeof value !== 'number' || Number.isInteger(value)) {
    return value;
  }
  const rounded = Number(value.toFixed(12));
  return rounded;
}

function evaluate() {
  if (currentOperator === null || shouldResetDisplay || firstValue === null) {
    return;
  }

  secondValue = display.textContent;
  const result = operate(currentOperator, firstValue, secondValue);

  if (typeof result === 'string') {
    updateDisplay(result);
    firstValue = null;
    currentOperator = null;
    shouldResetDisplay = true;
    decimalButton.disabled = false;
    return;
  }

  const rounded = roundResult(result);
  updateDisplay(rounded);
  firstValue = rounded;
  currentOperator = null;
  secondValue = null;
  shouldResetDisplay = true;
  lastActionWasEquals = true;
  decimalButton.disabled = String(rounded).includes('.');
}

function handleOperator(operator) {
  if (isErrorMessage(display.textContent)) {
    return;
  }

  if (currentOperator !== null && !shouldResetDisplay) {
    evaluate();
  }

  if (display.textContent === '' || isErrorMessage(display.textContent)) {
    return;
  }

  if (!lastActionWasEquals || currentOperator !== null) {
    firstValue = Number(display.textContent);
  }

  currentOperator = operator;
  shouldResetDisplay = true;
  lastActionWasEquals = false;
  decimalButton.disabled = false;
}

function handleBackspace() {
  if (shouldResetDisplay || lastActionWasEquals || isErrorMessage(display.textContent)) {
    updateDisplay('0');
    shouldResetDisplay = false;
    lastActionWasEquals = false;
    decimalButton.disabled = false;
    return;
  }

  const currentText = display.textContent;
  if (currentText.length <= 1) {
    updateDisplay('0');
  } else {
    updateDisplay(currentText.slice(0, -1));
  }

  if (!display.textContent.includes('.')) {
    decimalButton.disabled = false;
  }
}

function handleKeyPress(event) {
  const key = event.key;

  if (key === 'Escape') {
    resetCalculator();
    return;
  }

  if (key === 'Backspace') {
    handleBackspace();
    return;
  }

  if (key === 'Enter' || key === '=') {
    evaluate();
    return;
  }

  if (key === '.') {
    appendDecimal();
    return;
  }

  if (/[0-9]/.test(key)) {
    appendDigit(key);
    return;
  }

  if (['+', '-', '*', '/'].includes(key)) {
    handleOperator(key);
  }
}

resetCalculator();

digitButtons.forEach((button) => {
  button.addEventListener('click', () => appendDigit(button.dataset.digit));
});

operatorButtons.forEach((button) => {
  button.addEventListener('click', () => handleOperator(button.dataset.operator));
});

clearButton.addEventListener('click', resetCalculator);
backspaceButton.addEventListener('click', handleBackspace);
equalsButton.addEventListener('click', evaluate);
decimalButton.addEventListener('click', appendDecimal);
window.addEventListener('keydown', handleKeyPress);
