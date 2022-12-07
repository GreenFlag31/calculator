const mathOperations = {
  add: (n1, n2) => n1 + n2,
  subtract: (n1, n2) => n1 - n2,
  multiply: (n1, n2) => n1 * n2,
  divide: (n1, n2) => n1 / n2
}
const {add, subtract, multiply, divide} = mathOperations

const symbolsToOperations = {
  '+': add,
  '-': subtract,
  '*': multiply,
  '/': divide
}

// const operandSymbols = ['+', '-', '*', '/']



function operate(operation, n1, n2) {

  return symbolsToOperations[operation](n1, n2)

}
// console.log(operate('+', 5, 2));


const display = document.querySelector('.current')
const numberButtons = document.querySelectorAll('button')
const allowedChar = '[0-9]|\s|=|\/|\*|-|\+'

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (RemovingElements(button)) return

    if (CheckIfPossibleOperation(button.textContent)) return


    display.insertAdjacentText('beforeend', button.textContent)
  })
})

/**
 * @param {HTMLElement} button 
 * @return {boolean}
 */
function RemovingElements(button) {
  if (button.textContent === 'DEL') {
    display.textContent = display.textContent.substring(0, display.textContent.length - 1)
    return true
  } else if (button.textContent === 'AC') {
    display.textContent = ''
    return true
  }

  return false
}

/**
 * 
 * @param {HTMLElement} button 
 * @return {boolean}
 */
function CheckIfPossibleOperation(button) {
  // debugger
  const splittedOperation = display.textContent.split(button)
  const [firstOperand, lastOperand] = splittedOperation
  const minLengthForOperation = splittedOperation.length === 2

  if (!minLengthForOperation) return false

  if (symbolsToOperations[button] || button.textContent === '=') {
    display.textContent = operate(button, +firstOperand, +lastOperand)
    // the value has to be stored in a variable to make further operations
    return true
  }

  return false
}