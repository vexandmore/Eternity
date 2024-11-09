import React from "react";

interface DataSeries {
  name: string;
  data: any[];
}

interface ContentScreenProps {
  seriesList: DataSeries[];
  selectedSeriesIndex: number | null;
  onSelectSeries: (index: number) => void;
  onAddSeries: () => void;
}

const ContentScreen: React.FC<ContentScreenProps> = ({
  seriesList,
  selectedSeriesIndex,
  onSelectSeries,
  onAddSeries,
}) => {
  return (
    <div className="content-screen">
      {/* Display Area for Selected Series Data */}
      <div className="data-display">
        {selectedSeriesIndex !== null && (
          <table className="excel-table">
            <thead>
              <tr>
                {Object.keys(seriesList[selectedSeriesIndex].data[0] || {}).map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {seriesList[selectedSeriesIndex].data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((value, cellIndex) => (
                    <td key={cellIndex}>{String(value)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Bottom Section with Scrollable Tabs and Fixed + Button */}
      <div className="tab-container">
        <div className="tabs-scrollable">
          {seriesList.map((series, index) => (
            <div
              key={index}
              className={`tab ${selectedSeriesIndex === index ? 'active' : ''}`}
              onClick={() => onSelectSeries(index)}
            >
              {series.name}
            </div>
          ))}
        </div>
        <input
          type="file"
          id="file-upload"
          style={{ display: 'none' }}
          onChange={onAddSeries}
        />
        <button
          className="add-button"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ContentScreen;
