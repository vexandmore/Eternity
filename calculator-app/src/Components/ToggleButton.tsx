import React from "react";

interface ToggleButtonProps {
  units: string; // "DEG" or "RAD"
  setUnits: (units: string) => void; // Function to update the units
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ units, setUnits }) => {
  return (
    <div className="toggle-button">
      <button
        className={`toggle-button-segment ${
          units === "DEG" ? "selected-units-button" : "unselected-units-button"
        }`}
        onClick={() => setUnits("DEG")}
      >
        DEG
      </button>
      <button
        className={`toggle-button-segment ${
          units === "RAD" ? "selected-units-button" : "unselected-units-button"
        }`}
        onClick={() => setUnits("RAD")}
      >
        RAD
      </button>
    </div>
  );
};

export default ToggleButton;
