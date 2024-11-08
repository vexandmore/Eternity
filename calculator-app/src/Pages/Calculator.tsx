import React, { useState } from "react";
import Display from "../Components/Display";
import Button from "../Components/Button";
import History from "../Components/History"; // Import the History component
import { parse } from 'mathjs';
import { evaluate_custom } from "../Scripts/Evaluator";
import './Calculator.css';
import Papa from 'papaparse';

const Calculator: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [history, setHistory] = useState<{ equation: string; result: string }[]>([]);
  const [csvData, setCsvData] = useState<any[]>([]); // State to store CSV data

  const handleButtonClick = (value: string) => {
    if (value === "=") {
      try {
        // Use mathjs to parse into tree
        let expression_tree = parse(input);
        let evaluatedResult = evaluate_custom(expression_tree);

        // Add the equation and result to history
        const newHistoryItem = { equation: input, result: evaluatedResult.toString() };
        setHistory([...history, newHistoryItem]);

        setResult(evaluatedResult.toString());
      } catch (error) {
        console.log(error);
        setResult(String(error));
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      Papa.parse(file, {
        complete: (result) => {
          setCsvData(result.data);
          console.log(result.data); // Log or process the CSV data
        },
        header: true
      });
    }
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
          <Button label="acos" onClick={() => handleButtonClick("acos(")} />
          <Button label="x^y"  onClick={() => handleButtonClick("^(")} />
          <Button label="SD"   onClick={() => handleButtonClick("SD(")} />
          <input 
            type="file" 
            accept=".csv" 
            style={{ display: "none" }} 
            id="file-upload" 
            onChange={handleFileUpload} 
          />
          <Button label="Import CSV" onClick={() => document.getElementById('file-upload')?.click()} />
        </div>
      </div>
      <History history={history} onSelect={handleSelectFromHistory} /> {/* Render the History component */}
      
      {/* Display CSV Data */}
      <div className="csv-data">
        {csvData.length > 0 && (
          <table>
            <thead>
              <tr>
                {Object.keys(csvData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{String(value)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Calculator;
