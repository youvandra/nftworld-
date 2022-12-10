import React from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

const Price_history = ({ classes, priceHistory }) => {
  const monthes = Object.keys(priceHistory);
  const avgPrice = Object.keys(priceHistory).map(
    (month) => priceHistory[month].avgPrice
  );

  const numSales = Object.keys(priceHistory).map(
    (month) => priceHistory[month].numSales
  );

  if (monthes.length === 0)
    return (
      <p className="text-center text-lg text-jacarta-400 mt-6 font-medium">
        This NFT has no price history
      </p>
    );

  return (
    <div className="relative mb-24 w-full">
      {/* <!-- Price History --> */}
      <div className="tab-pane fade">
        <div className={classes}>
          {/* <!-- Period / Stats --> */}
          <div className="mb-10 flex flex-wrap items-center">
            <select className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 mr-8 min-w-[12rem] rounded-lg py-3.5 text-sm dark:text-white">
              <option defaultValue="7-days">Last 6 months</option>
            </select>
          </div>

          {/* <!-- Chart --> */}
          <div className="chart-container relative h-80 w-full">
            <Bar
              data={{
                labels: monthes,
                datasets: [
                  {
                    type: "line",
                    label: "Avg. price",
                    backgroundColor: "#10B981",
                    borderColor: "#10B981",
                    data: avgPrice,
                  },
                  {
                    type: "bar",
                    label: "Sales",
                    backgroundColor: "#E7E8EC",
                    data: numSales,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                interaction: {
                  intersect: false,
                  mode: "index",
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                  y: {
                    ticks: {
                      stepSize: 50,
                    },
                  },
                },
                plugins: {
                  legend: { display: false },
                  decimation: {
                    enabled: true,
                  },
                  tooltip: {
                    usePointStyle: true,
                    position: "nearest",
                    backgroundColor: "#131740",
                    titleAlign: "center",
                    bodyAlign: "center",
                    footerAlign: "center",
                    padding: 12,
                    displayColors: false,
                    yAlign: "bottom",
                  },
                },
                animation: false,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Price_history;
