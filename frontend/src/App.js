import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = useCallback((num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  }, [display, waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const clear = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  }, []);

  const performOperation = useCallback((nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  }, [display, previousValue, operation]);

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = useCallback(() => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  }, [display, previousValue, operation]);

  // Keyboard event handler
  const handleKeyPress = useCallback((event) => {
    event.preventDefault();
    
    const key = event.key;
    
    // Numbers 0-9
    if (key >= '0' && key <= '9') {
      inputNumber(parseInt(key));
    }
    // Decimal point
    else if (key === '.' || key === ',') {
      inputDecimal();
    }
    // Operations
    else if (key === '+') {
      performOperation('+');
    }
    else if (key === '-') {
      performOperation('-');
    }
    else if (key === '*') {
      performOperation('×');
    }
    else if (key === '/') {
      performOperation('÷');
    }
    // Equals
    else if (key === '=' || key === 'Enter') {
      handleEquals();
    }
    // Clear
    else if (key === 'Escape' || key.toLowerCase() === 'c') {
      clear();
    }
    // Backspace
    else if (key === 'Backspace') {
      setDisplay(display.slice(0, -1) || '0');
    }
  }, [display, inputNumber, inputDecimal, performOperation, handleEquals, clear]);

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const Button = ({ onClick, className = '', children, ...props }) => (
    <button
      className={`calculator-button ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );

  return (
    <div className="App">
      <div className="calculator-container">
        <h1 className="calculator-title">A Beautiful Calculator</h1>
        <div className="calculator">
          <div className="keyboard-hint">
            ⌨️ Use keyboard for input
          </div>
          <div className="display">
            <div className="display-value" data-length={display.length}>{display}</div>
          </div>
          <div className="button-grid">
            <Button onClick={clear} className="function">AC</Button>
            <Button onClick={() => performOperation('÷')} className="operator">÷</Button>
            <Button onClick={() => performOperation('×')} className="operator">×</Button>
            <Button onClick={() => setDisplay(display.slice(0, -1) || '0')} className="function">⌫</Button>
            
            <Button onClick={() => inputNumber(7)}>7</Button>
            <Button onClick={() => inputNumber(8)}>8</Button>
            <Button onClick={() => inputNumber(9)}>9</Button>
            <Button onClick={() => performOperation('-')} className="operator">-</Button>
            
            <Button onClick={() => inputNumber(4)}>4</Button>
            <Button onClick={() => inputNumber(5)}>5</Button>
            <Button onClick={() => inputNumber(6)}>6</Button>
            <Button onClick={() => performOperation('+')} className="operator">+</Button>
            
            <Button onClick={() => inputNumber(1)}>1</Button>
            <Button onClick={() => inputNumber(2)}>2</Button>
            <Button onClick={() => inputNumber(3)}>3</Button>
            <Button onClick={handleEquals} className="equals" rowSpan="2">=</Button>
            
            <Button onClick={() => inputNumber(0)} className="zero">0</Button>
            <Button onClick={inputDecimal}>.</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
