import React from "react";
import "./Display.css";

interface DisplayProps {
  input: string;
  result: string;
}

const Display: React.FC<DisplayProps> = ({ input, result }) => {
  return (
    <div className="display">
      <span className="display-input">{input}</span>
      <span className="display-result">= {result}</span>
    </div>
  );
};

export default Display;
