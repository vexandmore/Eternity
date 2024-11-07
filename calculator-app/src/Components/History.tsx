import React from "react";
import "./History.css";

interface HistoryItem {
  equation: string;
  result: string;
}

interface HistoryProps {
  history: HistoryItem[];
  onSelect: (equation: string) => void;
}

const History: React.FC<HistoryProps> = ({ history, onSelect }) => {
  // Show only the last few history items
  const displayedHistory = history.slice(-5);

  // Fill empty placeholders so that we always display 5 lines
  const historyWithPlaceholders = Array.from(
    { length: Math.max(5 - displayedHistory.length, 0) },
    () => ({ equation: "", result: "" })
  ).concat(displayedHistory);

  return (
    <div className="history">
      <ul>
        {historyWithPlaceholders.map((item, index) => (
          <li key={index} onClick={() => item.equation && onSelect(item.equation)}>
            <span className="history-item-left">{item.equation}</span>
            <span className="history-item-right">{item.result && `= ${item.result}`}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
