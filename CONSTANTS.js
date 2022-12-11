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


export { symbolsToOperations, translateExpression }