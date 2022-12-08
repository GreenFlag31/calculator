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

const translateExpression = {
  'Enter': '=',
  'Backspace': 'DEL',
  'Delete': 'DEL',
  'Escape': 'AC',
  '/': '÷',
}

/**
 * @param {string} operation 
 * @param {number} n1 
 * @param {number} n2 
 * @return {(n1: number, n2: number) => number}
 */
function operate(operation, n1, n2) {

  return symbolsToOperations[operation](n1, n2)

}


const display = document.querySelector('.current')
const inputButtons = document.querySelectorAll('button')
const calculator = document.querySelector('.calculator-grid')
const allowedChar = /^\d|=|\/|\*|-|\+|\.|Enter|Backspace|Delete|Escape/
const onlyDigits = /\d/
let divisionByZeroError = false




/** Mouse inputs */
 inputButtons.forEach(button => {
  button.addEventListener('click', () => {
    const btnContent = button.textContent

    AddPressedBtnAnimation(button)
    ProcessToResult(btnContent)
  })
})


/** Keyboard inputs */
document.addEventListener("keyup", (e) => {
  let expression = e.key
  // if user reloads page, do not add a shake animation
  if (expression === 'F5') return

  // debugger
  const correspondingbtn = FindCorrespondingButton(expression)
  
  if (allowedChar.test(expression) === false ||
  correspondingbtn.hasAttribute('disabled')) {
    AddShakeAnimation()
    return
  }
  
  if (translateExpression[expression]) {
    expression = translateExpression[expression]
  } 
  ProcessToResult(expression)
})


function AddShakeAnimation() {
  calculator.classList.add('shake')
  setTimeout(() => calculator.classList.remove('shake'), 1000)
}

/**
 * @param {HTMLButtonElement} input 
 */
function AddPressedBtnAnimation(input) {
  input.classList.add('validate')
  setTimeout(() => input.classList.remove('validate'), 300)
}

/**
 * @param {string} expression 
 */
function FindCorrespondingButton(expression) {
  for (btn of Array.from(inputButtons)) {
    if (btn.textContent === expression) {
      AddPressedBtnAnimation(btn)
      return btn
    }
  }
}


/**
 * calls functions and event. display the result on calculator
 * @param {HTMLElement} value 
 */
function ProcessToResult(value) {
  if (RemovingElements(value)) return
  // a computation is possible and '=' pressed, just display results
  // do not display further operator if a division by 0 occured && operations chained
  if (CheckIfPossibleOperation(value) && value === '=' || divisionByZeroError) return

  // debugger
  if (onlyDigits.test(value)) {
    DisableActionsButtons(false)
  }
  display.insertAdjacentText('beforeend', value)
}

  
/**
 * @param {HTMLElement} button
 * @return {boolean}
 */
function RemovingElements(value) {
  ResetContent()

  if (value === 'DEL') {
    display.textContent = display.textContent.substring(0, display.textContent.length - 1)
    return true
  } else if (value === 'AC') {
    display.textContent = ''
    return true
  }

  return false
}

/**
 * Reset back to normal appearance. Last computation introduced an error
 */
function ResetContent() {
  if (divisionByZeroError) {
    display.style.color = 'white'
    display.textContent = ''
  }

  divisionByZeroError = false
}




/**
 * @param {boolean} disable 
 */
function DisableActionsButtons(disable) {
  const actionsButtons = document.querySelectorAll('button.action')
  actionsButtons.forEach(actionsButton => {
    if (disable) {
      actionsButton.setAttribute('disabled', '')
      actionsButton.classList.remove('enabled')
    } else {
      actionsButton.removeAttribute('disabled')
      actionsButton.classList.add('enabled')
    }
  })
}
DisableActionsButtons(true)

/**
 * @param {HTMLElement} button 
 * @return {boolean}
 * disable buttons if actions were called !
 */
function CheckIfPossibleOperation(button) {
  // debugger
  if (!symbolsToOperations[button] && button !== '=') return false
  let result = ''

  PopulatehashmapOperators(button)
  DisableActionsButtons(true)

  const splittedOperation = display.textContent.split(hashmapOperators['operator'])
  const [firstOperand, lastOperand] = splittedOperation
  const minLengthForOperation = splittedOperation.length === 2
  if (!minLengthForOperation) return false

  result = operate(hashmapOperators['operator'], +firstOperand, +lastOperand)
  if (result === Infinity) {
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
