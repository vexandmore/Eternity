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
  return (
    <div className="history">
      <ul>
        {history.map((item, index) => (
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
