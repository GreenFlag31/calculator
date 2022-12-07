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
  '÷': divide
}

// const operandSymbols = ['+', '-', '*', '÷']



function operate(operation, n1, n2) {

  return symbolsToOperations[operation](n1, n2)

}


const display = document.querySelector('.current')
const numberButtons = document.querySelectorAll('button')
const allowedChar = '/\d|=|\/|\*|-|\+|Enter/g'
let divisionByZeroError = false

const expression = '1'
allowedChar.test(expression)

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (RemovingElements(button)) return

    const btnContent = button.textContent

    // a computation is possible and '=' pressed, just display results
    // do not display further operator if a division by 0 occured && operations chained
    if (CheckIfPossibleOperation(btnContent) && btnContent === '=' || divisionByZeroError) return

    display.insertAdjacentText('beforeend', btnContent)
  })
})
  
/**
 * @param {HTMLElement} button
 * @return {boolean}
 */
function RemovingElements(button) {
  ResetContent()

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
 * Reset back to normal
 */
function ResetContent() {
  if (divisionByZeroError) {
    display.style.color = 'white'
    display.textContent = ''
  }

  divisionByZeroError = false
}

/**
 * @param {HTMLElement} button 
 * @return {boolean}
 */
function CheckIfPossibleOperation(button) {
  // debugger
  if (!symbolsToOperations[button] && button !== '=') return false
  let result = ''

  PopulatehashmapOperators(button)

  const splittedOperation = display.textContent.split(hashmapOperators['operator'])
  const [firstOperand, lastOperand] = splittedOperation
  const minLengthForOperation = splittedOperation.length === 2
  if (!minLengthForOperation) return false

  result = operate(hashmapOperators['operator'], +firstOperand, +lastOperand)

  if (result === Infinity) {
    // debugger
    display.textContent = 'Division by zero error'
    display.style.color = 'red'
    divisionByZeroError = true
    hashmapOperators = {}
    return true
  }

  display.textContent = result
  if (symbolsToOperations[button]) hashmapOperators['operator'] = button


  return true
}


let hashmapOperators = {}
/**
 * This function stores the operator needed for computation.
 * @param {HTMLElement} button 
 * @return {boolean}
 */
function PopulatehashmapOperators(button) {
  if (hashmapOperators['operator']) return

  hashmapOperators['operator'] = button
}
