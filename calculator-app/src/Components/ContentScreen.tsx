import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import { VscGraphLine, VscGraph } from "react-icons/vsc";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

interface DataSeries {
  name: string;
  data: { [key: string]: any }[];
}

interface ContentScreenProps {
  seriesList: DataSeries[];
  selectedSeriesIndex: number | null;
  onSelectSeries: (index: number) => void;
  onAddSeries: () => void;
  onDragSeries: (seriesName: string) => void;
  graphFunction?: string | null;
  onGraphButtonClick: () => void;
}

const ContentScreen: React.FC<ContentScreenProps> = ({
  seriesList,
  selectedSeriesIndex,
  onSelectSeries,
  onAddSeries,
  onDragSeries,
  graphFunction,
  onGraphButtonClick,
}) => {
  const [showHistogram, setShowHistogram] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [lineGraphData, setLineGraphData] = useState<any>(null);

  const getHistogramData = () => {
    if (selectedSeriesIndex !== null) {
      const selectedData = seriesList[selectedSeriesIndex].data;
      const sampleItem = selectedData[0];
      const numericKey = sampleItem
        ? Object.keys(sampleItem).find((key) => !isNaN(parseFloat(sampleItem[key])))
        : null;

      if (!numericKey) {
        console.warn("No numeric column found in dataset.");
        return null;
      }

      const values = selectedData.map((item) => parseFloat(item[numericKey])).filter((v) => !isNaN(v));
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

  useEffect(() => {
    if (graphFunction && showGraph) {
      const xValues = Array.from({ length: 21 }, (_, i) => i - 10); // Range -10 to 10
      const yValues = xValues.map((x) => {
        try {
          switch (graphFunction) {
            case "sin":
              return Math.sin(x);
            case "cos":
              return Math.cos(x);
            case "tan":
              return Math.tan(x);
            case "log":
              return x > 0 ? Math.log(x) : NaN;
            case "sqrt":
              return x >= 0 ? Math.sqrt(x) : NaN;
            default:
              return 0;
          }
        } catch {
          return NaN;
        }
      });

      setLineGraphData({
        labels: xValues,
        datasets: [
          {
            label: `${graphFunction} Graph`,
            data: yValues,
            borderColor: "rgba(75, 192, 192, 1)",
            fill: false,
          },
        ],
      });
    }
    // Clean up the chart instance when component unmounts
    return () => {
      setLineGraphData(null); // Reset the graph data
    };
  }, [graphFunction, showGraph]);

  const toggleHistogram = () => {
    setShowHistogram(true);
    setShowGraph(false);
  };

  const toggleGraph = () => {
    setShowHistogram(false);
    setShowGraph(true);
    onGraphButtonClick();
  };

  return (
    <div className="content-screen">
      <button className="graph-button" onClick={toggleGraph}>
        <VscGraphLine />
      </button>
      <button className="histogram-button" onClick={toggleHistogram}>
        <VscGraph />
      </button>

      <div className="data-display">
        {selectedSeriesIndex !== null && !showHistogram && !showGraph && (
          <table className="data-table">
            <thead>
              <tr>
                <th colSpan={Object.keys(seriesList[selectedSeriesIndex].data[0] || {}).length}>
                  {seriesList[selectedSeriesIndex].name}
                </th>
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
        {showGraph && lineGraphData && (
          <Line
            data={lineGraphData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true, position: "top" },
                title: {
                  display: true,
                  text: `${graphFunction} Graph`,
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
                const seriesData = series.data.map((item) => parseFloat(Object.values(item)[0]) || 0);
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
          style={{ display: "none" }}
          onChange={onAddSeries}
        />
        <button className="add-button" onClick={() => document.getElementById("file-upload")?.click()}>
          +
        </button>
      </div>
    </div>
  );
};

export default ContentScreen;
