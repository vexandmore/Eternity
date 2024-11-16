import React from "react";
import "./Button.css";

interface ButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
  dataKey?: string; // Add a dataKey prop to link the button with a keyboard key
}

const Button: React.FC<ButtonProps> = ({ label, onClick, className, dataKey }) => (
  <button
    onClick={onClick}
    className={`button ${className}`}
    data-key={dataKey} // Add the data-key attribute
  >
    {label}
  </button>
);

export default Button;
