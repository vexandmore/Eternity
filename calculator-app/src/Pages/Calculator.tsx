import React, { useState, useRef } from "react";
import Display from "../Components/Display";
import Button from "../Components/Button";
import ContentScreen from "../Components/ContentScreen";
import History from "../Components/History";
import { parse } from "mathjs";
import { evaluate_custom } from "../Scripts/Evaluator";
import { makeMessage } from "../Scripts/ParseErrorInterpreter";
import "./Calculator.css";
import Papa from "papaparse";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);



interface DataSeries {
  name: string;
  data: any[];
}

const Calculator: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [history, setHistory] = useState<{ equation: string; result: string }[]>([]);
  const [seriesList, setSeriesList] = useState<DataSeries[]>([]);
  const [selectedSeriesIndex, setSelectedSeriesIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [graphFunction, setGraphFunction] = useState<string | null>(null); // Define graphFunction state

  // const [showHistogram, setShowHistogram] = useState<boolean>(false);

  const [parseError, setParseError] = useState<string>("");
  
  const handleButtonClick = (value: string) => {
    if (value === "=") {
      try {
        let expression_tree = parse(input);
        let evaluatedResult = evaluate_custom(expression_tree);
  
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
      setParseError("");
    } else if (value === "DEL") {
      // Handle delete within "SD()"
      if (input.includes("SD(") && input.endsWith(")")) {
        const start = input.indexOf("SD(") + 3; // Start index of the content within "SD("
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
    } else if (value === "σ") {
      // Check if "SD()" is already in the input to avoid duplicates
      if (input.includes("SD()")) return;
      setInput(input + "SD()"); // Add "SD()" with empty parentheses
    } else {
      // Check if input ends with "SD()" and insert the value inside the parentheses
      if (input.endsWith("SD()")) {
        // Insert value inside the parentheses, keeping commas within
        const updatedInput = input.slice(0, -1) + value + ")";
        setInput(updatedInput);
      } else if (input.includes("SD(") && input.endsWith(")")) {
        // Ensure commas are added correctly inside SD function
        const end = input.lastIndexOf(")");     // End index of the content within "SD("
        const updatedInput = input.slice(0, end) + value + input.slice(end);
        setInput(updatedInput);
      } else {
        let new_input = input + value;      
      try {
        let expression_tree = parse(new_input);
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
        if (input.endsWith("SD()")) {
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
  

// Inside Calculator component's handleGraphButtonClick function
const handleGraphButtonClick = () => {
  console.log("Graph button clicked");
  const graphableFunctions = ["sin", "cos", "tan", "log", "sqrt"];
  const detectedFunction = graphableFunctions.find((func) => input.includes(func)); // Checks if the function exists in input
  if (detectedFunction) {
    console.log("Detected function for graphing:", detectedFunction);
    setGraphFunction(detectedFunction); // Set the detected function to graph
  } else {
    console.log("No graphable function detected in the input.");
    alert("No graphable function detected in the input.");
  }
};



  return (
    <div className="calculator-container">
      <h1 className="calculator-title">ETERNITY</h1>
      <div className="calculator" onDrop={handleDropOnInput} onDragOver={(e) => e.preventDefault()} > 
      <div className="history-display-wrapper">
      <History history={history} onSelect={handleSelectFromHistory} />
      <Display input={input} result={result} error={parseError} />
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
        <Button label="σ" className="transcendental-button" onClick={() => handleButtonClick("SD()")} />
        <Button label="0" className="number-button" onClick={() => handleButtonClick("0")} />
        <Button label="." className="number-button" onClick={() => handleButtonClick(".")} />
        
        {/* Equal Button spans two rows */}
        <Button label="=" className="equal-button" onClick={() => handleButtonClick("=")} />
      </div>
      <ContentScreen
  seriesList={seriesList}
  selectedSeriesIndex={selectedSeriesIndex}
  onSelectSeries={handleSelectSeries}
  onAddSeries={handleAddSeriesClick}
  onDragSeries={(name: string) => window.localStorage.setItem("draggedSeries", name)}
  graphFunction={graphFunction}
  onGraphButtonClick={handleGraphButtonClick} // Pass the function as a prop
/>


          <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
        
      </div>
    </div>
    </div>

  );
};


export default Calculator;