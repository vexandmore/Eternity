import React, {useState} from "react";
import warning from "./warning.png";
import "./Display.css";

interface DisplayProps {
  input: string;
  result: string;
  error: string;
}

const Display: React.FC<DisplayProps> = ({ input, result, error }) => {
  if (error.length > 0 ) {
    return (
      <div className="display">
        <span className="display-input">{input}</span>
        <span className="display-error" title={error}><img src={warning} width="22px" height="22px"></img></span>
      </div>
    ); 
  } else {
    return (
      <div className="display">
        <span className="display-input">{input}</span>
        <span className="display-result">= {result}</span>
      </div>
    );
  }
};

export default Display;
