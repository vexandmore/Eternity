import React, { useState } from "react";
import Display from "../Components/Display";
import Button from "../Components/Button";
import ContentScreen from "../Components/ContentScreen";
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

  
  let csv_content = (<p>Future content will go here</p>);
  if (csvData.length !== 0) {
    csv_content = (
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
    )
  }  


  return (
    <div className="calculator-container">
      <h1 className="calculator-title">ETERNITY</h1>

        <div className="calculator">
        <div className="history-display-wrapper">
          <History history={history} onSelect={handleSelectFromHistory} />
          <Display input={input} result={result} />
        </div>
        <div className="main-content">

        <div className="buttons">
      
        {/* First Row */}
        <Button label="a^b" className="operator-button" onClick={() => handleButtonClick("a^b(")} />
        <Button label="x!" className="operator-button" onClick={() => handleButtonClick("x!")}/>
        <Button label="∧" className="operator-button" onClick={() => handleButtonClick("^")} />
        <Button label="↶" className="operator-button" onClick={() => handleButtonClick("UNDO")} />
        <Button label="↷" className="operator-button" onClick={() => handleButtonClick("REDO")} />
        <Button label="DEL" className="operator-button" onClick={() => handleButtonClick("DEL")} />
        <Button label="AC" className="operator-button" onClick={() => handleButtonClick("C")} />
    
        {/* Second Row */}
        <Button label="a²" className="operator-button" onClick={() => handleButtonClick("a^2")}/>
        <Button label="aᵇ" className="operator-button" onClick={() => handleButtonClick("a^b(")} />
        <Button label="|a|" className="operator-button" onClick={() => handleButtonClick("abs(")} />
        <Button label="←" className="operator-button" onClick={() => handleButtonClick("BACK")} />
        <Button label="→" className="operator-button" onClick={() => handleButtonClick("FORWARD")} />
        <Button label="%" className="operator-button" onClick={() => handleButtonClick("%")}/>
        <Button label="ANS" className="operator-button" onClick={() => handleButtonClick("ANS")}/>
    
        {/* Third Row */}
        <Button label="√" className="operator-button" onClick={() => handleButtonClick("sqrt(")} />
        <Button label="ⁿ√" className="operator-button" onClick={() => handleButtonClick("root(")} />
        <Button label="π" className="operator-button" onClick={() => handleButtonClick("pi")} />
        <Button label="(" className="operator-button" onClick={() => handleButtonClick("(")} />
        <Button label=")" className="operator-button" onClick={() => handleButtonClick(")")} />
        <Button label="," className="operator-button" onClick={() => handleButtonClick(",")}/>
        <Button label="÷" className="operator-button" onClick={() => handleButtonClick("/")} />
    
        {/* Fourth Row */}
        <Button label="sin" className="operator-button" onClick={() => handleButtonClick("sin(")} />
        <Button label="cos" className="operator-button" onClick={() => handleButtonClick("cos(")} />
        <Button label="tan" className="operator-button" onClick={() => handleButtonClick("tan(")} />
        <Button label="7" className="number-button" onClick={() => handleButtonClick("7")} />
        <Button label="8" className="number-button" onClick={() => handleButtonClick("8")} />
        <Button label="9" className="number-button" onClick={() => handleButtonClick("9")} />
        <Button label="x" className="operator-button" onClick={() => handleButtonClick("*")} />
    
        {/* Fifth Row */}
        <Button label="log" className="operator-button" onClick={() => handleButtonClick("log(")} />
        <Button label="ln" className="operator-button" onClick={() => handleButtonClick("ln(")} />
        <Button label="e^x" className="operator-button" onClick={() => handleButtonClick("e^(")} />
        <Button label="4" className="number-button" onClick={() => handleButtonClick("4")} />
        <Button label="5" className="number-button" onClick={() => handleButtonClick("5")} />
        <Button label="6" className="number-button" onClick={() => handleButtonClick("6")} />
        <Button label="-" className="operator-button" onClick={() => handleButtonClick("-")} />
    
        {/* Sixth Row */}
        <Button label="arccos(x)" className="transcendental-button" onClick={() => handleButtonClick("arccos(")} />
        <Button label="xʸ" className="transcendental-button" onClick={() => handleButtonClick("x^y(")} />
        <Button label="logb(x)" className="transcendental-button" onClick={() => handleButtonClick("logb(")} />
        <Button label="1" className="number-button" onClick={() => handleButtonClick("1")} />
        <Button label="2" className="number-button" onClick={() => handleButtonClick("2")} />
        <Button label="3" className="number-button" onClick={() => handleButtonClick("3")} />
        <Button label="+" className="operator-button" onClick={() => handleButtonClick("+")} />
    
        {/* Seventh Row */}
        <Button label="MAD" className="transcendental-button" onClick={() => handleButtonClick("MAD(")} />
        <Button label="sinh(x)" className="transcendental-button" onClick={() => handleButtonClick("sinh(")} />
        <Button label="σ" className="transcendental-button" onClick={() => handleButtonClick("SD(")} />
        <Button label="0" className="number-button" onClick={() => handleButtonClick("0")} />
        <Button label="." className="number-button" onClick={() => handleButtonClick(".")} />

        {/* Equal Button spans two rows */}
        <Button label="=" className="equal-button" onClick={() => handleButtonClick("=")} />

        {/* Eighth row, for the csv button */}
        <input 
          type="file" 
          accept=".csv" 
          style={{ display: "none" }} 
          id="file-upload" 
          onChange={handleFileUpload} 
          />
        <Button label="Import CSV" onClick={() => document.getElementById('file-upload')?.click()} />

      </div>

      <ContentScreen content={csv_content} />
 
      </div>
    </div>
    </div>

  );
};


export default Calculator;
