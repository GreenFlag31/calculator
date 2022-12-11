import { symbolsToOperations, translateExpression } from './CONSTANTS.js'
import { PopulatehashmapOperators, DisableEqualBtn, AddShakeAnimation, FindCorrespondingButton, RemovingElements, CheckActionsButtons, CheckDotSeparator,  CheckLastDisplayedValue, SplitCurrentOperation, CheckEqualsBtn, CheckZeroDivision, AddPressedBtnAnimation, AnimateResultDisplay, RoundResult, DisableActionsButtons, DisableDotSeparator, EnableStartingNegativeN, divisionByZeroError, hashmapOperators, display, ResetHashmapOperators, ChangeStatusResultAsked, resultAsked } from './helpers.js'



/**
 * @param {string} operation 
 * @param {number} n1 
 * @param {number} n2 
 * @return {(n1: number, n2: number) => number}
 */
function operate(operation, n1, n2) {
  return symbolsToOperations[operation](n1, n2)
}



const inputButtons = document.querySelectorAll('button')
const allowedChar = /^\d|=|÷|\*|-|\+|\.|DEL|AC/
const onlyDigits = /\d/
DisableEqualBtn(true)
DisableActionsButtons(true)
DisableDotSeparator(true)
EnableStartingNegativeN()



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
    EnableStartingNegativeN()
    DisableDotSeparator(true)
  }
  ChangeStatusResultAsked(false)
  // a computation is possible and '=' pressed, just display results
  // do not display further operator if a division by 0 occured && operations chained
  if (CheckIfPossibleOperation(value) && value === '=' || divisionByZeroError) {
    DisableEqualBtn(true)
    CheckLastDisplayedValue()
    ResetHashmapOperators()
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
  
  if (value === '=') ChangeStatusResultAsked(true)
  else ChangeStatusResultAsked(false)
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

export { inputButtons, onlyDigits }
