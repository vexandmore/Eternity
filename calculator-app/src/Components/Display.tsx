import React from "react";
import warning from "./warning.png";
import "./Display.css";

interface DisplayProps {
    input: string;
    result: string;
    error: string;
    onInputChange: (newInput: string) => void;
}

const Display: React.FC<DisplayProps> = ({ input, result, error, onInputChange }) => {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onInputChange(event.target.value); //Song: update the input value
    };

    if (error.length > 0) {
        return (
            <div className="display">
                <input
                    className="display-input"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Enter your expression"
                />
                <span className="display-error" title={error}>
          <img src={warning} width="22px" height="22px" alt="error" />
        </span>
            </div>
        );
    } else {
        return (
            <div className="display">
                <input
                    className="display-input"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Enter your expression"
                />
                <span className="display-result">= {result}</span>
            </div>
        );
    }
};

export default Display;