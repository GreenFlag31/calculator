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
const exe = document.querySelector(".execute")
const separator = document.querySelector(".separator")
const minus = document.querySelector(".minus")
const allowedChar = /^\d|=|÷|\*|-|\+|\.|DEL|AC/
const onlyDigits = /\d/
let divisionByZeroError = false
let resultAsked = false
let hashmapOperators = {}
DisableEqualBtn(true)
DisableActionsButtons(true)
DisableDotSeparator(true)
EnableStartingNegativeN()


// starting with neg numbers 


/** Mouse inputs */
inputButtons.forEach(button => {
  // Disabled elements don't fire mouse events :/
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
    DisableDotSeparator(true)
  }
  resultAsked = false
  // a computation is possible and '=' pressed, just display results
  // do not display further operator if a division by 0 occured && operations chained
  if (CheckIfPossibleOperation(value) && value === '=' || divisionByZeroError) {
    DisableEqualBtn(true)
    CheckLastDisplayedValue()
    hashmapOperators = {}
    return
  }
  
  CheckActionsButtons(value)

  display.insertAdjacentText('beforeend', value)
  AnimateResultDisplay(display, 600)
  CheckEqualsBtn()
  CheckDotSeparator()
}


/**
 * @param {string} value 
 * @return {boolean}
 */
function CheckIfPossibleOperation(value) {
  if (!symbolsToOperations[value] && value !== '=') return false
  let result = ''
  
  PopulatehashmapOperators(value)
  DisableActionsButtons(true)
  DisableDotSeparator(true)
  
  if (value === '=') resultAsked = true
  else resultAsked = false
  const [firstOperand, lastOperand] = SplitCurrentOperation()
  if (!firstOperand || !lastOperand) return false

  result = operate(hashmapOperators['operator'], +firstOperand, +lastOperand)

  if (CheckZeroDivision(result)) {
    return true
  }

  display.textContent = RoundResult(result)
  display.classList.add("going-up")
  CheckDotSeparator()
  if (symbolsToOperations[value]) hashmapOperators['operator'] = value
  return true
}



/** @return {boolean} */
function minLengthForOperation() {
  const splittedOperation = SplitCurrentOperation()
  const minLengthForOperation = splittedOperation.length === 2
  if (!minLengthForOperation) {
    return false
  }

  return true
}


/** @return {Array} */
function SplitCurrentOperation() {
  let splittedOperation = display.textContent.split(hashmapOperators['operator'])

  if (splittedOperation.length === 3) {
    const startingNegative = StartingWithNegOperator(splittedOperation)
    return startingNegative
  }

  splittedOperation = splittedOperation.filter(element => element !== '')

  return splittedOperation
}

/**
 * Exception with starting negative number, subtraction
 * @param {Array} splittedOperation 
 * @return {Array}
 */
function StartingWithNegOperator(splittedOperation) {
  return [hashmapOperators['operator'] + splittedOperation[1], 
  splittedOperation[2]].filter(element => element !== '')
}


/**
 * This function stores the operator needed for computation.
 * @param {HTMLElement} value 
 * @return {boolean}
 */
function PopulatehashmapOperators(value) {
  if (value === '=') return

  const startingNeg = display.textContent.substring(0, 1)
  if (symbolsToOperations[startingNeg] && symbolsToOperations[startingNeg] !== value) {
    hashmapOperators['operator'] = value
    return
  }
  if (hashmapOperators['operator']) return

  hashmapOperators['operator'] = value
}

/** @param {boolean} disable */
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
 * @param {string} button
 * @return {boolean}
 */
function RemovingElements(value) {
  ResetContent()
  display.classList.remove('going-up')

  
  if (value === 'DEL') {
    display.textContent = display.textContent.substring(0, display.textContent.length - 1)
    if (resultAsked) DisableDotSeparator(true)
    else CheckDotSeparator()

    RemoveSingleElement(display.textContent)
    return true

  } else if (value === 'AC') {
    display.textContent = ''
    DisableEqualBtn(true)
    DisableActionsButtons(true)
    DisableDotSeparator(true)
    hashmapOperators = {}
    resultAsked = false
    return true
  }

  CheckDotSeparator(value)
  return false
}


/** @param {string} displayedContent */
function RemoveSingleElement(displayedContent) {
  if (resultAsked) {
    display.textContent = ''
    displayedContent = ''
    resultAsked = false
  }  

  if (displayedContent.length === 0) {
    DisableActionsButtons(true)
    DisableEqualBtn(true)
  } else {
    CheckActionsButtons(displayedContent[displayedContent.length - 1])
    CheckEqualsBtn()
  }

  if (display.textContent.indexOf(hashmapOperators['operator']) === -1) {
    hashmapOperators = {}
  }
}


/** @param {string} value */
function CheckActionsButtons(value) {
  if (RegexTestOnlyDigits(value)) {
    DisableActionsButtons(false)
  } else {
    DisableActionsButtons(true)
  }
}


/**
 * Solely one check, if last operand in {Array} contains a '.', disable button.
 * @param {?string} value 
 */
function CheckDotSeparator(value = '') {
  if (display.textContent === '') {
    DisableDotSeparator(true)
    return
  }

  const wholeExpression = display.textContent + value
  const completeOperation = SplitCompleteOperation(wholeExpression)

  const checkOnLastOperand = completeOperation.at(-1)
  if (checkOnLastOperand?.indexOf('.') !== -1) {
    DisableDotSeparator(true)
  } else {
    DisableDotSeparator(false)
  }
}


/**
 * This function returns operand(s), if operands > 1 an operator has been used.
 * @param {string} wholeExpression 
 * @return {Array}
 */
function SplitCompleteOperation(wholeExpression) {
  let splittedOperation = wholeExpression.split(hashmapOperators['operator'])
  splittedOperation = splittedOperation.filter(element => element !== '')

  return splittedOperation
}
 
/**
 * @param {string} value 
 * @return {boolean}
 */
function RegexTestOnlyDigits(value) {
  if (onlyDigits.test(value)) {
    return true
  }

  return false
}


function CheckLastDisplayedValue() {
  const lastDisplayedValue = display.textContent[display.textContent.length - 1]
  CheckActionsButtons(lastDisplayedValue)
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

/** @param {boolean} disable */
function DisableDotSeparator(disable) {
  if (disable) {
    separator.setAttribute('disabled', '')
    separator.classList.remove('enabled')
  } else {
    separator.removeAttribute('disabled')
    separator.classList.add('enabled')
  }
}

/** At start, enable negative numbers */
function EnableStartingNegativeN() {
  minus.removeAttribute('disabled')
  minus.classList.add('enabled')
}