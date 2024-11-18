import React from "react";
import "./Button.css";

interface ButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, className }) => (
  <button onClick={onClick} className={`button ${className}`}>
    {label}
  </button>
);

export default Button;

