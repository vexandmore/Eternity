import React, { useState, useEffect, useRef } from "react";
import Display from "../Components/Display";
import Button from "../Components/Button";
import ContentScreen from "../Components/ContentScreen";
import History from "../Components/History";
import ToggleButton from "../Components/ToggleButton";
import { parse } from "mathjs";
import { evaluate_custom, CalculatorContext, makeErrorMessage } from "../Scripts/Evaluator";
import { Units } from "../Scripts/Functions";
import "./Calculator.css";
import Papa from "papaparse";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { makeMessage } from "../Scripts/ParseErrorInterpreter";

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
  // While going backward through history, some will be hidden (for when we redo)
  const [hiddenHistory, setHiddenHistory] = useState<{ equation: string; result: string }[]>([]);
  const [justPressedEquals, setJustPressedEquals] = useState<boolean>(false);
  const [units, setUnits] = useState<Units>(Units.RAD);
  const [seriesList, setSeriesList] = useState<DataSeries[]>([]);
  const [selectedSeriesIndex, setSelectedSeriesIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

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
        // Prevent us from redoing beyond here
        setHiddenHistory([]);

        setResult(strResult);
        setJustPressedEquals(true);
      } catch (error) {
        if (error instanceof SyntaxError) {
          let errorMessage = makeMessage(input, error);
          setParseError(errorMessage);
        } else {
          setParseError(String(error));
        }
      }
    } else if (value === "C") {
      setInput("");
      setResult("");
      setParseError("");
    } else if (value === "DEL") {
      let delIndex = (inputRef?.current?.selectionStart ?? input.length) - 1;
      if (delIndex < 0) {
        return;
      }
      let newInput = input.slice(0, delIndex) + input.slice(delIndex + 1);
      setInput(newInput);
      setParseError(makeErrorMessage(newInput));
      placeCursorAt(delIndex);
      // Make it so that after deleting, can continue editing (even if just pressed =)
      setJustPressedEquals(false);
    } else if (value === "AC") {
        setInput("");
        setResult("");
        setHistory([]);
        setHiddenHistory([]);
        setParseError("");
    } else {
      let new_input;
      if (justPressedEquals) {
        setResult(""); // If we just produced an answer, clear after next input into the field
        setInput(value);
        setJustPressedEquals(false);
        new_input = value;
        // For SD(), logb(), etc place cursor in middle of brackets
        if (value.endsWith("()")) {
          placeCursorAt(value.length - 1);
        } else {
          placeCursorAt(value.length);
        }
      } else {
        let addIndex = inputRef?.current?.selectionStart ?? input.length;
        new_input = input.slice(0, addIndex) + value + input.slice(addIndex);
        addIndex = addIndex + value.length;
        
        if (value.endsWith("()")) {
          placeCursorAt(addIndex - 1);
        } else {
          placeCursorAt(addIndex);
        }
      }
      setParseError(makeErrorMessage(new_input));
      setInput(new_input);
    }
  };

  const placeCursorAt = (index: number) => {
    setTimeout(() => {
            inputRef?.current?.focus();
            inputRef?.current?.setSelectionRange(index, index);
    }, 100);
  }

  const undo = () => {
    if (history.length === 0) {
      return;
    }

    // Move current into the hidden history
    let currentEquation = {equation: input, result: result};
    setHiddenHistory([currentEquation, ...hiddenHistory]);
    // Grab previous from history and display it
    let toShow = history[history.length - 1];
    setHistory(history.slice(0, history.length - 1));
    setInput(toShow.equation);
    setResult(toShow.result);
  };

  const redo = () => {
    if (hiddenHistory.length === 0) {
      return;
    }
    // set aside what we were at
    setHistory([...history, {equation: input, result: result}]);
    // Grab the future element
    let toShow = hiddenHistory[0];
    setHiddenHistory([...hiddenHistory.slice(1)]);
    // Display it
    setInput(toShow.equation);
    setResult(toShow.result);
  };

  const moveLeft = () => {
    if (inputRef?.current?.selectionStart != null) {
      let newCursorLocation = inputRef.current.selectionStart - 1;
      newCursorLocation = newCursorLocation < 0 ? 0 : newCursorLocation;
      inputRef.current.setSelectionRange(newCursorLocation, newCursorLocation);
      inputRef.current.focus();
    } else {
      console.log("no ref");
    }
  };

  const moveRight = () => {
    if (inputRef?.current?.selectionStart != null) {
      let newCursorLocation = inputRef.current.selectionStart + 1;
      newCursorLocation = newCursorLocation > input.length ? input.length : newCursorLocation;
      inputRef.current.setSelectionRange(newCursorLocation, newCursorLocation);
      inputRef.current.focus();
    } else {
      console.log("no ref");
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
    setParseError(makeErrorMessage(newInput));
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
      }
      else if(key === "Enter")
      {
        (button as HTMLButtonElement).click(); // Simulate button click
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
            ref={inputRef}
          />
    </div>
     <div className="main-content">
        <div className="buttons">
        <ToggleButton units={units === Units.DEG ? "DEG" : "RAD"} // Pass current units
         setUnits={(newUnits) => setUnits(newUnits === "DEG" ? Units.DEG : Units.RAD)  } // Handle unit changes 
         />

        {/* <Button label="deg"  className={units === Units.DEG ? "selected-units-button" : "operator-button"} onClick={() => setUnits(Units.DEG)} />
        <Button label="rad"  className={units === Units.RAD ? "selected-units-button" : "operator-button"} onClick={() => setUnits(Units.RAD)} /> */}
        <Button label="x" dataKey="x" className="operator-button" onClick={() => handleButtonClick("x")} />
        <Button label="↶" className="operator-button" onClick={() => undo()} />
        <Button label="↷" className="operator-button" onClick={() => redo()} />
        <Button label="AC" dataKey="shift+Delete" className="operator-button" onClick={() => handleButtonClick("AC")} />
        <Button label="C" dataKey="Delete" className="operator-button" onClick={() => handleButtonClick("C")} />

        {/* Second Row */}
        <Button label="a²" dataKey="shift+p" className="operator-button" onClick={() => handleButtonClick("^2")} />
        <Button label="x!" dataKey="!" className="operator-button" onClick={() => handleButtonClick("!")} />
        <Button label="|a|" dataKey="|" className="operator-button" onClick={() => handleButtonClick("abs()")} />
        <Button label="←"  className="operator-button" onClick={moveLeft} />
        <Button label="→"  className="operator-button" onClick={moveRight} />
        <Button label="DEL" dataKey="Backspace" className="operator-button" onClick={() => handleButtonClick("DEL")} />
        <Button label="ANS" dataKey="a" className="operator-button" onClick={() => handleButtonClick("ANS")} />

        {/* Third Row */}
        <Button label="√" dataKey="r" className="operator-button" onClick={() => handleButtonClick("sqrt()")} />
        <Button label="ⁿ√" dataKey="shift+r" className="operator-button" onClick={() => handleButtonClick("root()")} />
        <Button label="π" dataKey="p" className="operator-button" onClick={() => handleButtonClick("pi")} />
        <Button label="(" dataKey="(" className="operator-button" onClick={() => handleButtonClick("(")} />
        <Button label=")" dataKey=")" className="operator-button" onClick={() => handleButtonClick(")")} />
        <Button label="," dataKey="," className="operator-button" onClick={() => handleButtonClick(",")} />
        <Button label="÷" dataKey="÷" className="operator-button" onClick={() => handleButtonClick("/")} />

        {/* Fourth Row */}
        <Button label="sin" dataKey="s" className="operator-button" onClick={() => handleButtonClick("sin()")} />
        <Button label="cos" dataKey="c" className="operator-button" onClick={() => handleButtonClick("cos()")} />
        <Button label="tan" dataKey="t" className="operator-button" onClick={() => handleButtonClick("tan()")} />
        <Button label="7" dataKey="7" className="number-button" onClick={() => handleButtonClick("7")} />
        <Button label="8" dataKey="8" className="number-button" onClick={() => handleButtonClick("8")} />
        <Button label="9" dataKey="9" className="number-button" onClick={() => handleButtonClick("9")} />
        <Button label="x" dataKey="*" className="operator-button" onClick={() => handleButtonClick("*")} />

        {/* Fifth Row */}
        <Button label="%" dataKey="%" className="operator-button" onClick={() => handleButtonClick("%")} />
        <Button label="ln" dataKey="shift+l" className="operator-button" onClick={() => handleButtonClick("ln()")} />
        <Button label="e^x" dataKey="e" className="operator-button" onClick={() => handleButtonClick("e^()")} />
        <Button label="4" dataKey="4" className="number-button" onClick={() => handleButtonClick("4")} />
        <Button label="5" dataKey="5" className="number-button" onClick={() => handleButtonClick("5")} />
        <Button label="6" dataKey="6" className="number-button" onClick={() => handleButtonClick("6")} />
        <Button label="-" dataKey="-" className="operator-button" onClick={() => handleButtonClick("-")} />

        {/* Sixth Row */}
        <Button label="arccos(x)" dataKey="shift+c"  className="transcendental-button long-text"  onClick={() => handleButtonClick("arccos()")} />
        <Button label="x^y" dataKey="^" className="transcendental-button" onClick={() => handleButtonClick("^()")} />
        <Button label="logb(x)" dataKey="l"  className="transcendental-button long-text" onClick={() => handleButtonClick("logb()")} />
        <Button label="1" dataKey="1" className="number-button" onClick={() => handleButtonClick("1")} />
        <Button label="2" dataKey="2" className="number-button" onClick={() => handleButtonClick("2")} />
        <Button label="3" dataKey="3" className="number-button" onClick={() => handleButtonClick("3")} />
        <Button label="+" dataKey="+" className="operator-button" onClick={() => handleButtonClick("+")} />

        {/* Seventh Row */}
        <Button label="mad"  dataKey="m" className="transcendental-button" onClick={() => handleButtonClick("mad()")} />
        <Button label="sinh(x)" dataKey="shift+s"  className="transcendental-button long-text" onClick={() => handleButtonClick("sinh()")} />
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