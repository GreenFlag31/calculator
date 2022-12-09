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


// TODO : handle '.' /!\


const display = document.querySelector('.current')
const inputButtons = document.querySelectorAll('button')
const calculator = document.querySelector('.calculator-grid')
const exe = document.querySelector(".execute")
const allowedChar = /^\d|=|÷|\*|-|\+|\.|DEL|AC/
const onlyDigits = /\d/
let divisionByZeroError = false
let resultAsked = false
let hashmapOperators = {}
DisableEqualBtn(true)
DisableActionsButtons(true)




/** Mouse inputs */
inputButtons.forEach(button => {
  button.addEventListener('click', () => {
    
    AddPressedBtnAnimation(button)
    if (button.hasAttribute('disabled')) {
      AddShakeAnimation()
      return
    }
    const btnContent = button.textContent

    ProcessToResult(btnContent)
  })
})


/** Keyboard inputs */
document.addEventListener("keyup", (e) => {
  let expression = e.key
  if (expression === 'F5') return

  if (translateExpression[expression]) {
    expression = translateExpression[expression]
  } 
  const correspondingbtn = FindCorrespondingButton(expression)
  
  if (allowedChar.test(expression) === false ||
  correspondingbtn.hasAttribute('disabled')) {
    AddShakeAnimation()
    return
  }
  
  ProcessToResult(expression)
})


/**
 * calls functions and event. display the result on calculator
 * @param {HTMLElement} value 
 */
function ProcessToResult(value) {
  if (RemovingElements(value)) return

  if (resultAsked && onlyDigits.test(value)) {
    display.textContent = ''
    resultAsked = false
  }
  // a computation is possible and '=' pressed, just display results
  // do not display further operator if a division by 0 occured && operations chained
  if (CheckIfPossibleOperation(value) && value === '=' || divisionByZeroError) {
    DisableEqualBtn(true)
    CheckLastDisplayedValue()
    hashmapOperators = {}
    return
  }
  
  // debugger
  RegexTestOnlyDigits(value)

  display.insertAdjacentText('beforeend', value)
  AnimateResultDisplay(display, 600)
  CheckEqualsBtn()
}


/**
 * @param {HTMLElement} button 
 * @return {boolean}
 */
function CheckIfPossibleOperation(button) {
  if (!symbolsToOperations[button] && button !== '=') return false
  let result = ''

  PopulatehashmapOperators(button)
  DisableActionsButtons(true)

  if (button === '=') resultAsked = true
  else resultAsked = false
  if (!minLengthForOperation()) return false

  const [firstOperand, lastOperand] = SplitCurrentOperation()
  result = operate(hashmapOperators['operator'], +firstOperand, +lastOperand)

  if (CheckZeroDivision(result)) {
    return true
  }

  display.textContent = RoundResult(result)
  AnimateResultDisplay(display, 400)
  if (symbolsToOperations[button]) hashmapOperators['operator'] = button
  return true
}



/** @return {boolean} */
function minLengthForOperation() {
  let splittedOperation = SplitCurrentOperation()
  // Weirdly, splitting a number and an action ('5+') with '+' separator creates an array of length 2 ('5', '') :
  splittedOperation = splittedOperation.filter(element => element !== '')
  const minLengthForOperation = splittedOperation.length === 2
  if (!minLengthForOperation) {
    return false
  }

  return true
}


/** @return {Array} */
function SplitCurrentOperation() {
  const splittedOperation = display.textContent.split(hashmapOperators['operator'])

  return splittedOperation
}


/**
 * This function stores the operator needed for computation.
 * @param {HTMLElement} button 
 * @return {boolean}
 */
function PopulatehashmapOperators(button) {
  if (hashmapOperators['operator']) return

  hashmapOperators['operator'] = button
}


function DisableEqualBtn(disable) {
  if (disable) {
    exe.setAttribute('disabled', '')
    exe.classList.remove('enabled')
  } else {
    exe.removeAttribute('disabled')
    exe.classList.add('enabled')
  }
}

function AddShakeAnimation() {
  calculator.classList.add('shake')
  setTimeout(() => calculator.classList.remove('shake'), 1000)
}

/** @param {HTMLButtonElement} input */
function AddPressedBtnAnimation(input) {
  input.classList.add('validate')
  setTimeout(() => input.classList.remove('validate'), 300)
}

/** @param {string} expression */
function FindCorrespondingButton(expression) {
  for (btn of Array.from(inputButtons)) {
    if (btn.textContent === expression) {
      AddPressedBtnAnimation(btn)
      return btn
    }
  }
}


/**
 * @param {HTMLElement} button
 * @return {boolean}
 */
function RemovingElements(value) {
  ResetContent()
  
  if (value === 'DEL') {
    display.textContent = display.textContent.substring(0, display.textContent.length - 1)
    const displayedContent = display.textContent
    RemoveSingleElement(displayedContent)

    return true
  } else if (value === 'AC') {
    display.textContent = ''
    DisableEqualBtn(true)
    DisableActionsButtons(true)
    hashmapOperators = {}
    resultAsked = false
    return true
  }

  return false
}


/** @param {HTMLDivElement} displayedContent */
function RemoveSingleElement(displayedContent) {
  if (displayedContent.length === 0) {
    DisableActionsButtons(true)
    DisableEqualBtn(true)
  } else {
    RegexTestOnlyDigits(displayedContent[displayedContent.length - 1])
    CheckEqualsBtn()
  }

  if (resultAsked)  display.textContent = ''
  resultAsked = false

  if (display.textContent.indexOf(symbolsToOperations['operator']) === -1) {
    hashmapOperators = {}
  }
}


/** @param {number} value */
function RegexTestOnlyDigits(value) {
  if (onlyDigits.test(value)) {
    DisableActionsButtons(false)
  } else {
    DisableActionsButtons(true)
  }
}


function CheckLastDisplayedValue() {
  const lastDisplayedValue = display.textContent[display.textContent.length - 1]
  RegexTestOnlyDigits(lastDisplayedValue)
}


function CheckEqualsBtn() {
  if (minLengthForOperation() === false) {
    DisableEqualBtn(true)
  } else {
    DisableEqualBtn(false)
  } 
}


/**
 * @param {number} result 
 * @return {boolean}
 */
function CheckZeroDivision(result) {
  if (result === Infinity) {
    display.textContent = 'Division by zero error'
    display.style.color = 'red'
    AnimateResultDisplay(display, 300)
    divisionByZeroError = true
    hashmapOperators = {}
    return true
  }

  return false
}


/**
 * @param {HTMLDivElement} element 
 */
function AnimateResultDisplay(element, duration) {
  const keyframes = [{ opacity: 0 }, { opacity: 1 }]
  const options = {  
    duration,
    easing: 'ease-out',
    fill: 'forwards'
  }

  element.animate(keyframes, options)
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
 * @param {number} result 
 * @return {number}
 */
function RoundResult(result) {
  return Math.round(result * 100) / 100
}

/** @param {boolean} disable */
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

