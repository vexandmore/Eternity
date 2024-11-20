import React from "react";
import warning from "./warning.png";
import "./Display.css";

interface DisplayProps {
  input: string;
  result: string;
  error: string;
  onInputChange?: (newInput: string) => void;
}
 
const Display: React.FC<DisplayProps> = ({ input, result, error, onInputChange }) => {
  if (error.length > 0) {
    return (
      <div className="display">
        <input
          type="text"
          className="display-input"
          placeholder="Enter Equation"
          value={input}
          onChange={(e) => onInputChange && onInputChange(e.target.value)}
        />
        <span className="display-error" title={error}>
          <img src={warning} width="22px" height="22px" alt="Error icon" />
        </span>
      </div>
    );
  } else {
    return (
      <div className="display">
        <input
          type="text"
          className="display-input"
          value={input}
          onChange={(e) => onInputChange && onInputChange(e.target.value)}
        />
        <span className="display-result">= {result}</span>
      </div>
    );
  }
};

export default Display;
