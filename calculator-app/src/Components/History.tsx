import React, { useEffect, useRef } from "react";
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
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (historyRef.current) {
      // Scrolls to the bottom every time a new item is added
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]); // Runs every time the history array changes

  const placeholderCount = Math.max(5 - history.length, 0); // Number of placeholders to maintain 5 rows

  return (
    <div className="history" ref={historyRef}>
      <ul>
        {Array.from({ length: placeholderCount }).map((_, index) => (
          <li key={`placeholder-${index}`} className="placeholder">
            <span className="history-item-left">&nbsp;</span>
            <span className="history-item-right">&nbsp;</span>
          </li>
        ))}
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
