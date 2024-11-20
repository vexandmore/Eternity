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
import {CalculatorContext, evaluate_custom} from "../Scripts/Evaluator";
import {Units} from "../Scripts/Functions";
import { parse } from "mathjs";

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
  units: Units;
  history: { equation: string; result: string }[]
  onGraphButtonClick: () => void;
}

const ContentScreen: React.FC<ContentScreenProps> = ({
  seriesList,
  selectedSeriesIndex,
  onSelectSeries,
  onAddSeries,
  onDragSeries,
  graphFunction,
  units,
  history,
  onGraphButtonClick,
}) => {
  const [showHistogram, setShowHistogram] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [lineGraphData, setLineGraphData] = useState<any>(null);

  // Get histogram data based on selected series
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
            backgroundColor: "rgba(92, 179, 255, 0.6)",
            borderColor: "rgba(1, 1, 1, .7)",
            borderWidth: 1,
          },
        ],
      };
    }
    return null;
  };

  // Generate graph data if a function is selected
  useEffect(() => {
    if (graphFunction && showGraph) {
      try{
        const xValues = Array.from({ length: 201 }, (_, i) => i*0.1 - 10); // Range -10 to 10
        const yValues = []; // Using an object for key-value pairs
        let lastAnswer = (history.length > 0)? parseFloat(history[history.length - 1].result) : 0
        for (let x of xValues) { // Iterate over values, not indexes
          const temp_function = graphFunction.replace(/(?<![a-zA-Z])x(?![a-zA-Z])/g, x.toString());
          let expression_tree = parse(temp_function);
          yValues.push(evaluate_custom(expression_tree, new CalculatorContext(units, lastAnswer))); // Assign x as the key
        }
        for(let i = 0; i < yValues.length; i++)
          console.log(xValues[i], ":", yValues[i]);

        setLineGraphData({
          labels: xValues,  // Use your custom xValues array, which contains -10, -9.9, ..., 10
          datasets: [
            {
              label: `${graphFunction} Graph`,
              data: yValues,
              borderColor: "rgba(92, 179, 255, 0.6)",
              fill: false,
              pointRadius: 0, // Hide the points
            },
          ],
        });
      }
      catch {
      }
    } else {
      setLineGraphData(null);
    }
  }, [graphFunction, showGraph]);

  const histogramData = getHistogramData();

  const toggleHistogram = () => {
    setShowHistogram(!showHistogram);
    setShowGraph(false); // Hide graph if histogram is toggled
  };

  const toggleGraph = () => {
    setShowGraph(!showGraph);
    setShowHistogram(false); // Hide histogram if graph is toggled
    if (!showGraph) onGraphButtonClick();
  };

  const handleSeriesClick = (index: number) => {
    onSelectSeries(index);
    setShowGraph(false); // Hide graph if a series is clicked
    setShowHistogram(false); // Hide histogram if a series is clicked
  };

  return (
    <div className="content-screen">
      <button
        className={`graph-button ${showGraph ? "button-active" : ""}`}
        onClick={toggleGraph}
      >
        <VscGraphLine />
      </button>
      <button
        className={`histogram-button ${showHistogram ? "button-active" : ""}`}
        onClick={toggleHistogram}
      >
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
        <div className="chart-container">
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
        </div>

        )}
        {showGraph && lineGraphData && (
         <div className="chart-container">
          <Line
            data = {lineGraphData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true, position: "top" },
                title: {
                  display: true,
                  text: `${graphFunction} Graph`,
                }
              },
              scales: {
                x: {
                  ticks:{
                    display: false
                  }
                }
              }
            }}
          />
          </div>
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
        <button className="add-button" onClick={onAddSeries}>
        <span className="plus-symbol">+</span>
        </button>
      </div>
    </div>
  );
  
};

export default ContentScreen;
