import React, { useState } from "react";
import Display from "../Components/Display";
import Button from "../Components/Button";
import History from "../Components/History"; // Import the History component
import {powerFunction} from "../Scripts/Functions"
import './Calculator.css';

const Calculator: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [history, setHistory] = useState<{ equation: string; result: string }[]>([]);

  const handleButtonClick = (value: string) => {
    if (value === "=") {
      try {
        // Replace custom functions with Math functions before evaluation
        const modifiedInput = input
          .replace(/cos/g, "Math.cos")
          .replace(/sin/g, "Math.sin")
          .replace(/tan/g, "Math.tan")
          .replace(/(\d+(\.\d+)?|\([\d\s.]+\))\s*\^\s*(\d+(\.\d+)?|\([\d\s.]+\))/g, "(powerFunction($1, $3))");
         
        const evaluatedResult = eval(modifiedInput); // Be cautious with eval for user-generated code

        // Add the equation and result to history
        const newHistoryItem = { equation: input, result: evaluatedResult.toString() };
        setHistory([...history, newHistoryItem]);

        setResult(evaluatedResult.toString());
      } catch (error) {
        setResult("Error");
      }
    } else if (value === "C") {
      setInput("");
      setResult("");
    } else if (value === "DEL") {
      // Delete the last character from input
      setInput(input.slice(0, -1));
    } else {
      setInput(input + value);
    }
  };

  const handleSelectFromHistory = (equation: string) => {
    setInput(input + equation); // Populate input with the selected equation
  };

  return (
    <div className="calculator">
      <Display input={input} result={result} />
      <div className="buttons">
        <div className="buttons-arithmetic">
          {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "/", "*", ".", "="].map((button) => (
            <Button key={button} label={button} onClick={() => handleButtonClick(button)} />
          ))}
          <Button label="(" onClick={() => handleButtonClick("(")} />
          <Button label=")" onClick={() => handleButtonClick(")")} />
          <Button label="C" onClick={() => handleButtonClick("C")} />
          <Button label="DEL" onClick={() => handleButtonClick("DEL")} />
        </div>
        <div className="buttons-scientific">
          <Button label="sin" onClick={() => handleButtonClick("sin(")} />
          <Button label="cos" onClick={() => handleButtonClick("cos(")} />
          <Button label="tan" onClick={() => handleButtonClick("tan(")} />
          <Button label="x^y" onClick={() => handleButtonClick("^(")} />
        </div>
      </div>
      <History history={history} onSelect={handleSelectFromHistory} /> {/* Render the History component */}
    </div>
  );
};

export default Calculator;
