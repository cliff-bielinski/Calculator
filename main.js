createCalculator();

function createCalculator() {
    createButtons('.number', addNumber);
    createButtons('.operation', includeOperator);
    createButtons('#backspace', deleteNumber);
    createButtons('#all-clear', clearAll);
    createButtons('.total',findTotal); 
    
    const numValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];
    const operatorValues = ['+', '-', '–', 'x', '*', '/', '÷'];

    /* adds keyboard support */
    document.addEventListener('keydown', (event) => {
        if (numValues.includes(event.key)) addNumber(event.key);
        else if (operatorValues.includes(event.key)) includeOperator(event.key);
        else if (event.key === 'Backspace') deleteNumber();
        else if (event.key === 'c') clearAll();
        else if (event.key === 't') findTotal();
    });

    let currentOperand = document.querySelector('.current-operand');
    let previousOperand = document.querySelector('.previous-operand');

    let resetNext = false; //true when next input should replace old string

    //when a button is clicked, it will call the associated function
    function createButtons(buttonClass, action) {
        let buttons = document.querySelectorAll(buttonClass);
        buttons.forEach((button) => {
            button.addEventListener('click', action)
        });
    }

    /* Takes the current operand and concatanates it with the HTML text of the button
     * that called it */
    function addNumber(input) {
        let inputtedValue = this.textContent || input;
        if(currentOperand.textContent.includes('.') && inputtedValue == '.') return; 
        if(currentOperand.textContent.length > 6) return; 
        if(currentOperand.textContent === '0' || resetNext){ 
            currentOperand.innerHTML = inputtedValue;
            resetNext = false;
        }
        else{
            currentOperand.innerHTML += inputtedValue;
        }
    }

    /* Takes the current operand and removes the last character or changes it to 0 if
     * only one character remains. */
    function deleteNumber() {
        if(currentOperand.textContent.length === 1) {
            currentOperand.innerHTML = '0';
        }
        else {
            currentOperand.innerHTML = 
            currentOperand.textContent.slice(0, -1);
        }
    }
    
    /*Resets the current and previous operand to string 0 */
    function clearAll() {
        currentOperand.innerHTML = '0';
        previousOperand.innerHTML = '0';
    }

    /* Adds an operator and moves the current operand to the previous operand. 
     * It also executes any expression if there is already an existing operator 
     * when called. */
    function includeOperator(input) {
        let operator = convertOperator(this.textContent || input);
        if (previousOperand.textContent === '0'){ 
            updateOperand(currentOperand.textContent, operator);
        }
        else { //if there exists an operator already, resolve previous operation first
            let oldOperator = previousOperand.textContent.slice(-1);
            previousOperand.textContent = previousOperand.textContent.slice(0, -2);
            let result = executeOperation(previousOperand.textContent, 
              currentOperand.textContent, oldOperator);
            updateOperand(result, operator);
        }

        //moves the current operand and operator to the previous operand space
        function updateOperand(operand, operator) {
            if (operand.includes('Ouch!')){
                previousOperand.innerHTML = '0';
                currentOperand.innerHTML = 'Ouch!';
                resetNext = true;
                return;
            }
            previousOperand.innerHTML = operand + ' ' + operator;
            currentOperand.innerHTML = '0';
        }

        //standardizes string representations for operators
        function convertOperator(operator) {
            if (operator === '/') return '÷';
            else if (operator === '*') return 'x';
            else if (operator === '-') return '–';
            else return operator;
        }
    }

    /* if a full expression is detected, executes expression and displays result */
    function findTotal() {
        let operator = previousOperand.textContent.slice(-1);
        if(['+', '–', 'x', '÷'].includes(operator)){
            previousOperand.textContent = previousOperand.textContent.slice(0, -2);
            let result = executeOperation(previousOperand.textContent,
              currentOperand.textContent, operator);
            previousOperand.innerHTML = '0';
            currentOperand.innerHTML = result;
            resetNext = true; //next input will replace currentOperand
        }
        else return;
    }

    /* Function that takes the two operands as strings and returns the value of the
     * executed operation as a number. */
    function executeOperation(firstOperand, secondOperand, operator) {
        firstOperand = Number(firstOperand);
        secondOperand = Number(secondOperand);
        switch (operator) {
            case '+':
                return checkSize(firstOperand + secondOperand);
            case '–':
                return checkSize(firstOperand - secondOperand);
            case 'x':
                return checkSize(firstOperand * secondOperand);
            case '÷':
                if (!secondOperand) {
                    return 'Ouch!';
                }
                else return checkSize(firstOperand / secondOperand);
        }

        /* Checks the size of the argument and converts to exponential notation
         * with very large and small values. Returns a string. */
        function checkSize(number) {
            let strNumber = number.toString();
            let absNumber = Math.abs(number);

            if (absNumber >= 1e100) return 'Huge!!';
            if (number && absNumber <= 1e-100) return 'Tiny!!';
            if (strNumber.length > 7) {
                strNumber = number.toExponential(2).toString();
                if (strNumber.length > 7) return number.toExponential(1).toString();
                else return strNumber;
            }
            return strNumber;
        }
    }
}








