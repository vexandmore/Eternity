import React from "react";
import { Bar } from "react-chartjs-2";
import { VscGraphLine } from "react-icons/vsc";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DataSeries {
  name: string;
  data: { [key: string]: any }[];
}

interface ContentScreenProps {
  seriesList: DataSeries[];
  selectedSeriesIndex: number | null;
  onSelectSeries: (index: number) => void;
  onAddSeries: () => void;
  onDragSeries: (seriesName: string) => void; // New prop for handling drag start
}

const ContentScreen: React.FC<ContentScreenProps> = ({
  seriesList,
  selectedSeriesIndex,
  onSelectSeries,
  onAddSeries,
  onDragSeries,
}) => {
  const [showHistogram, setShowHistogram] = React.useState(false);

  const toggleHistogram = () => {
    setShowHistogram(!showHistogram);
  };

  const getHistogramData = () => {
    if (selectedSeriesIndex !== null) {
      const selectedData = seriesList[selectedSeriesIndex].data;

      // Find a numeric key
      const sampleItem = selectedData[0];
      const numericKey = sampleItem
        ? Object.keys(sampleItem).find((key) => !isNaN(parseFloat(sampleItem[key])))
        : null;

      if (!numericKey) {
        console.warn("No numeric column found in dataset.");
        return null;
      }

      const values = selectedData
        .map((item) => parseFloat(item[numericKey]))
        .filter((v) => !isNaN(v));

      const frequencyMap = values.reduce((acc: Record<number, number>, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      }, {});

      const labels = Object.keys(frequencyMap).map((label) => label.toString());
      const frequencies = Object.values(frequencyMap);

      return {
        labels: labels,
        datasets: [
          {
            label: "Frequency",
            data: frequencies,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      };
    }
    return null;
  };

  const histogramData = getHistogramData();

  return (
    <div className="content-screen">
      <button
        className="histogram-button"
        onClick={toggleHistogram}
        style={{ position: 'absolute', top: '10px', right: '10px' }}
      >
        <VscGraphLine />
      </button>

      <div className="data-display">
        {selectedSeriesIndex !== null && !showHistogram && (
          <table className="data-table">
          <thead>
            <tr>
              <th colSpan={Object.keys(seriesList[selectedSeriesIndex].data[0] || {}).length}>
                {seriesList[selectedSeriesIndex].name} {/* Display the series name as the header */}
              </th>
            </tr>
          </thead>
          <tbody>
            {seriesList[selectedSeriesIndex].data.map((row: { [key: string]: any }, rowIndex: number) => (
              <tr key={rowIndex}>
                {Object.values(row).map((value, cellIndex) => (
                  <td key={cellIndex}>{String(value)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        )}
        {showHistogram && histogramData && selectedSeriesIndex !== null && (
          <Bar
            data={histogramData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true, position: "top" },
                title: {
                  display: true,
                  text: `${seriesList[selectedSeriesIndex].name} Histogram`,
                },
              },
            }}
          />
        )}
      </div>

      <div className="tab-container">
        <div className="tabs-scrollable">
          {seriesList.map((series, index) => (
            <div
              key={index}
              className={`tab ${selectedSeriesIndex === index ? "active" : ""}`}
              onClick={() => onSelectSeries(index)}
              draggable
              onDragStart={(e) => {
                const seriesData = series.data.map((item) => {
                  const value = Object.values(item)[0];
                  return parseFloat(value) || 0;
                });
                e.dataTransfer.setData("text/plain", JSON.stringify(seriesData));
                onDragSeries(series.name);
              }}
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
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ContentScreen;