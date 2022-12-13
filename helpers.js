import { symbolsToOperations } from './CONSTANTS.js'
import { inputButtons, onlyDigits } from './calculator.js'


const calculator = document.querySelector('.calculator-grid')
const display = document.querySelector('.current')
const exe = document.querySelector('.execute')
const separator = document.querySelector('.separator')
const minus = document.querySelector('.minus')
const zero = document.querySelector('.zero')
let resultAsked = false
let hashmapOperators = {}
let divisionByZeroError = false




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


function ResetHashmapOperators() {
  hashmapOperators = {}
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
  for (const btn of Array.from(inputButtons)) {
    if (btn.textContent === expression) {
      AddPressedBtnAnimation(btn)
      return btn
    }
  }
}


/** @param {string} value */
function CheckZeroIsAlreadyPresent(value) {
  let removing = false
  if (value === 'DEL' || value === 'AC') removing = true
  
  if (display.textContent.replace('-', '') === '' && value.replace('-', '') === '0') {
    DisableZero(true)
  } else if (SplitCompleteOperation(display.textContent + value)[1] === '0') {
    DisableZero(true)
  } else if (removing && display.textContent.at(-1) === '.') {
    DisableZero(true)
  } else {
    DisableZero(false)
  }
}

/** @param {boolean} disable  */
function DisableZero(disable) {
  if (disable) {
    zero.setAttribute('disabled', '')
    zero.classList.remove('enabled')
  } else {
    zero.removeAttribute('disabled')
    zero.classList.add('enabled')
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
    EnableStartingNegativeN()
    hashmapOperators = {}
    resultAsked = false
    return true
  }
  
  CheckDotSeparator(value)
  return false
}

/** @param {boolean} status */
function ChangeStatusResultAsked(status) {
  if (status) {
    resultAsked = true
  } else {
    resultAsked = false
  }
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
    EnableStartingNegativeN()
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

export { PopulatehashmapOperators, DisableEqualBtn, AddShakeAnimation, FindCorrespondingButton, RemovingElements, CheckActionsButtons, CheckDotSeparator, SplitCurrentOperation, CheckLastDisplayedValue, CheckEqualsBtn, CheckZeroDivision, AddPressedBtnAnimation, AnimateResultDisplay, RoundResult, DisableActionsButtons, DisableDotSeparator, EnableStartingNegativeN, divisionByZeroError, hashmapOperators, display, ResetHashmapOperators, ChangeStatusResultAsked, resultAsked, CheckZeroIsAlreadyPresent } 