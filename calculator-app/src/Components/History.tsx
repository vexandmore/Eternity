import React from "react";
import "./History.css"

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
    <span>
    {history.length === 0 ? (
        <span></span>
        ) : (
        <div className="history">
            <h3>History</h3>
            <ul>
                {history.map((item, index) => (
                <li key={index} onClick={() => onSelect(item.result)} className="history-item">
                    {item.equation} = {item.result}
                </li>
                ))}
            </ul>
        </div>
    )}
    </span>
  );
};

export default History;
