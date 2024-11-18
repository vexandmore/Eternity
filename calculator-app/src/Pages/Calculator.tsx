import React, { useState, useEffect, useRef } from "react";
import Display from "../Components/Display";
import Button from "../Components/Button";
import ContentScreen from "../Components/ContentScreen";
import History from "../Components/History";
import { parse } from "mathjs";
import { evaluate_custom, CalculatorContext } from "../Scripts/Evaluator";
import { Units } from "../Scripts/Functions";
import { makeMessage } from "../Scripts/ParseErrorInterpreter";
import "./Calculator.css";
import Papa from "papaparse";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);



interface DataSeries {
  name: string;
  data: any[];
}

function toNDecimalPlaces(n: number, places: number): string {
  let converted = n.toFixed(places);
  // Remove unnecessary trailing 0s
  let num_trailing_zeros = 0;
  for (let i = converted.length - 1; i >= 0; i--) {
    if (converted[i] === '.') {
      num_trailing_zeros++;
      break;
    } else if (converted[i] === '0') {
      num_trailing_zeros++;
    } else {
      break;
    }
  }
  return converted.slice(0, converted.length - num_trailing_zeros);
}

const Calculator: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [history, setHistory] = useState<{ equation: string; result: string }[]>([]);
  const [justPressedEquals, setJustPressedEquals] = useState<boolean>(false);
  const [units, setUnits] = useState<Units>(Units.RAD);
  const [seriesList, setSeriesList] = useState<DataSeries[]>([]);
  const [selectedSeriesIndex, setSelectedSeriesIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // const [showHistogram, setShowHistogram] = useState<boolean>(false);

  const [parseError, setParseError] = useState<string>("");
  
  const handleButtonClick = (value: string) => {
    if (value === "=") {
      try {
        // Build the context
        let lastAnswer: number;
        if (history.length === 0) {
          lastAnswer = NaN;
        } else {
          lastAnswer = parseFloat(history[history.length - 1].result);
        }
        let context = new CalculatorContext(units, lastAnswer);
        // Use mathjs to parse into tree
        let expression_tree = parse(input);
        let evaluatedResult = evaluate_custom(expression_tree, context);
        let strResult = toNDecimalPlaces(evaluatedResult, 7);

        // Add the equation and result to history
        const newHistoryItem = { equation: input, result: strResult };
        setHistory([...history, newHistoryItem]);

        setResult(strResult);
        setJustPressedEquals(true);
      } catch (error) {
        console.log(error);
        setResult(String(error));
      }
    } else if (value === "C") {
      setInput("");
      setResult("");
      setParseError("");
    } else if (value === "DEL") {
      // Handle delete within "SD()"
      if (input.includes("sd(") && input.endsWith(")")) {
        const start = input.indexOf("sd(") + 3; // Start index of the content within "SD("
        const end = input.lastIndexOf(")");     // End index of the content within "SD("
        const insideContent = input.slice(start, end);
        
        // If there's content inside "SD()", remove the last character of the content
        if (insideContent) {
          setInput(input.slice(0, start) + insideContent.slice(0, -1) + input.slice(end));
        }
      } else {
        // Regular delete if not inside "SD()"
        setInput(input.slice(0, -1));
      }
      // Make it so that after deleting, can continue editing (even if just pressed =)
      setJustPressedEquals(false);
    } else if (value === "σ") {
      // Check if "SD()" is already in the input to avoid duplicates
      if (input.includes("sd()")) return;
      setInput(input + "sd()"); // Add "SD()" with empty parentheses
    } else if (value === "AC") {
        setInput("");
        setResult("");
        setHistory([]);
    } else {
      
      // Check if input ends with "SD()" and insert the value inside the parentheses
      if (input.endsWith("sd()")) {
        // Insert value inside the parentheses, keeping commas within
        const updatedInput = input.slice(0, -1) + value + ")";
        setInput(updatedInput);
      } else if (input.includes("sd(") && input.endsWith(")")) {
        // Ensure commas are added correctly inside SD function
        const end = input.lastIndexOf(")");     // End index of the content within "SD("
        const updatedInput = input.slice(0, end) + value + input.slice(end);
        setInput(updatedInput);
      } else {
        let new_input;
        if (justPressedEquals) {
          setResult(""); // If we just produced an answer, clear after next input into the field
          setInput(value);
          setJustPressedEquals(false);
          new_input = value;
        } else {
          new_input = input + value;
        }
        try {
          // We parse, but don't care about the return value (we just case if it's successful)
          parse(new_input);
          setParseError("");
        } catch(e) {
          if (e instanceof SyntaxError) {
            setParseError(makeMessage(new_input, e));
          } else {
            setParseError(String(e));
          }
        }
        setInput(new_input);
      }    
    }
  };
 
  const handleSelectFromHistory = (equation: string) => {
    setInput(input + equation); // Populate input with the selected equation
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension from the name
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const csvData = e.target?.result as string;
        const parsedData = Papa.parse<{ [key: string]: any }>(csvData, { header: false, skipEmptyLines: true }).data;
  
        const convertedData = parsedData.map(row => {
          const convertedRow: { [key: string]: any } = {};
          for (let key in row) {
            const value = row[key];
            convertedRow[key] = isNaN(Number(value)) ? value : Number(value);
          }
          return convertedRow;
        });
  
        // Use the file name as the series name
        setSeriesList([...seriesList, { name: fileName, data: convertedData }]);
      };
      reader.readAsText(file);
    }
  };
  

  const handleAddSeriesClick = () => {
    fileInputRef.current?.click();
  };

  const handleSelectSeries = (index: number) => {
    setSelectedSeriesIndex(index);
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, data: number[]) => {
    event.dataTransfer.setData("text/plain", JSON.stringify(data));
  };

 
  const handleDropOnInput = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const seriesDataString = event.dataTransfer.getData("text/plain");
    if (seriesDataString) {
      try {
        const seriesData = JSON.parse(seriesDataString);
        if (input.endsWith("sd()")) {
          // Insert series data inside the "SD()" brackets
          const updatedInput = input.slice(0, -1) + seriesData.join(", ") + ")";
          setInput(updatedInput);
        } else {
          setInput((prevInput) => prevInput + seriesData.join(", "));
        }
      } catch (error) {
        console.error("Error parsing dropped data:", error);
      }
    }
  };
  
  const handleInputChange = (newInput: string) => {
    setInput(newInput);
  };


  // Inside Calculator component's handleGraphButtonClick function
  const handleGraphButtonClick = () => {

  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      let key = event.key; // The key pressed
      const isShiftPressed = event.shiftKey;
      if (isShiftPressed && /^[a-zA-Z]$/.test(key)) {
        key = "shift+"+key.toLowerCase();
      }
      const button = document.querySelector(`button[data-key="${key}"]`);
      const display = document.querySelector(`input[class="display-input"]`);
      if (button && (display as HTMLInputElement) !== document.activeElement) {
        (button as HTMLButtonElement).click(); // Simulate button click
        const display = document.querySelector(`input[class="display-input"]`);
      }
      else if(key === "Enter")
      {
        (button as HTMLButtonElement).click(); // Simulate button click
        const display = document.querySelector(`input[class="display-input"]`);
      }
    };
    const display = document.querySelector(`input[class="display-input"]`);
    (display as HTMLButtonElement).focus();
    // Attach the keydown event listener
    window.addEventListener("keydown", handleKeyDown);
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="calculator-container">
      <h1 className="calculator-title">ETERNITY</h1>
      <div className="calculator" onDrop={handleDropOnInput} onDragOver={(e) => e.preventDefault()} > 
      <div className="history-display-wrapper">
      <History history={history} onSelect={handleSelectFromHistory} />
      <Display
            input={input}
            result={result}
            error={parseError}
            onInputChange={handleInputChange} // Pass callback to Display
          />
    </div>
     <div className="main-content">
        <div className="buttons">
          
        <Button label="deg"  className={units === Units.DEG ? "selected-units-button" : "operator-button"} onClick={() => setUnits(Units.DEG)} />
        <Button label="rad"  className={units === Units.RAD ? "selected-units-button" : "operator-button"} onClick={() => setUnits(Units.RAD)} />
        <Button label="∧" dataKey="^" className="operator-button" onClick={() => handleButtonClick("^")} />
        <Button label="↶" className="operator-button" onClick={() => handleButtonClick("UNDO")} />
        <Button label="↷" className="operator-button" onClick={() => handleButtonClick("REDO")} />
        <Button label="AC" dataKey="shift+Delete" className="operator-button" onClick={() => handleButtonClick("AC")} />
        <Button label="C" dataKey="Delete" className="operator-button" onClick={() => handleButtonClick("C")} />

        {/* Second Row */}
        <Button label="a²" dataKey="shift+p" className="operator-button" onClick={() => handleButtonClick("^2")} />
        <Button label="x!" dataKey="!" className="operator-button" onClick={() => handleButtonClick("!")} />
        <Button label="|a|" dataKey="|" className="operator-button" onClick={() => handleButtonClick("abs(")} />
        <Button label="←"  className="operator-button" onClick={() => handleButtonClick("BACK")} />
        <Button label="→"  className="operator-button" onClick={() => handleButtonClick("FORWARD")} />
        <Button label="DEL" dataKey="Backspace" className="operator-button" onClick={() => handleButtonClick("DEL")} />
        <Button label="ANS" dataKey="a" className="operator-button" onClick={() => handleButtonClick("ANS")} />

        {/* Third Row */}
        <Button label="√" dataKey="r" className="operator-button" onClick={() => handleButtonClick("sqrt(")} />
        <Button label="ⁿ√" dataKey="shift+r" className="operator-button" onClick={() => handleButtonClick("root(")} />
        <Button label="π" dataKey="p" className="operator-button" onClick={() => handleButtonClick("pi")} />
        <Button label="(" dataKey="(" className="operator-button" onClick={() => handleButtonClick("(")} />
        <Button label=")" dataKey=")" className="operator-button" onClick={() => handleButtonClick(")")} />
        <Button label="," dataKey="," className="operator-button" onClick={() => handleButtonClick(",")} />
        <Button label="÷" dataKey="÷" className="operator-button" onClick={() => handleButtonClick("/")} />

        {/* Fourth Row */}
        <Button label="sin" dataKey="s" className="operator-button" onClick={() => handleButtonClick("sin(")} />
        <Button label="cos" dataKey="c" className="operator-button" onClick={() => handleButtonClick("cos(")} />
        <Button label="tan" dataKey="t" className="operator-button" onClick={() => handleButtonClick("tan(")} />
        <Button label="7" dataKey="7" className="number-button" onClick={() => handleButtonClick("7")} />
        <Button label="8" dataKey="8" className="number-button" onClick={() => handleButtonClick("8")} />
        <Button label="9" dataKey="9" className="number-button" onClick={() => handleButtonClick("9")} />
        <Button label="x" dataKey="*" className="operator-button" onClick={() => handleButtonClick("*")} />

        {/* Fifth Row */}
        <Button label="%" dataKey="%" className="operator-button" onClick={() => handleButtonClick("%")} />
        <Button label="ln" dataKey="shift+l" className="operator-button" onClick={() => handleButtonClick("ln(")} />
        <Button label="e^x" dataKey="e" className="operator-button" onClick={() => handleButtonClick("e^(")} />
        <Button label="4" dataKey="4" className="number-button" onClick={() => handleButtonClick("4")} />
        <Button label="5" dataKey="5" className="number-button" onClick={() => handleButtonClick("5")} />
        <Button label="6" dataKey="6" className="number-button" onClick={() => handleButtonClick("6")} />
        <Button label="-" dataKey="-" className="operator-button" onClick={() => handleButtonClick("-")} />

        {/* Sixth Row */}
        <Button label="arccos(x)" dataKey="shift+c" className="transcendental-button" onClick={() => handleButtonClick("arccos(")} />
        <Button label="^" dataKey="^" className="transcendental-button" onClick={() => handleButtonClick("^")} />
        <Button label="logb(x)" dataKey="l" className="transcendental-button" onClick={() => handleButtonClick("logb(")} />
        <Button label="1" dataKey="1" className="number-button" onClick={() => handleButtonClick("1")} />
        <Button label="2" dataKey="2" className="number-button" onClick={() => handleButtonClick("2")} />
        <Button label="3" dataKey="3" className="number-button" onClick={() => handleButtonClick("3")} />
        <Button label="+" dataKey="+" className="operator-button" onClick={() => handleButtonClick("+")} />

        {/* Seventh Row */}
        <Button label="mad"  dataKey="m" className="transcendental-button" onClick={() => handleButtonClick("mad(")} />
        <Button label="sinh(x)" dataKey="shift+s" className="transcendental-button" onClick={() => handleButtonClick("sinh(")} />
        <Button label="σ" dataKey="shift+d" className="transcendental-button" onClick={() => handleButtonClick("sd()")} />
        <Button label="0" dataKey="0" className="number-button" onClick={() => handleButtonClick("0")} />
        <Button label="." dataKey="." className="number-button" onClick={() => handleButtonClick(".")} />

        {/* Equal Button spans two rows */}
        <Button label="=" dataKey="Enter" className="equal-button" onClick={() => handleButtonClick("=")} />
      </div>
      <ContentScreen
        seriesList={seriesList}
        selectedSeriesIndex={selectedSeriesIndex}
        onSelectSeries={handleSelectSeries}
        onAddSeries={handleAddSeriesClick}
        onDragSeries={(name: string) => window.localStorage.setItem("draggedSeries", name)}
        graphFunction={input}
        units = {units}
        history = {history}
        onGraphButtonClick={handleGraphButtonClick} // Pass the function as a prop
      />


          <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
        
      </div>
    </div>
    </div>

  );
};


export default Calculator;