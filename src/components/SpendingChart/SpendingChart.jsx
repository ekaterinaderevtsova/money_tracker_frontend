import React from "react";
import "./SpendingChart.css";

const SpendingChart = ({ totalSpent }) => {
  return (
    <div>
      <div className="chart-labels">
        <span>{totalSpent} din</span>
        <span>18000 din</span>
      </div>
      <div className="chart-bar">
        <div
          className="chart-progress"
          style={{
            width: `${Math.min((totalSpent / 18000) * 100, 100)}%`,
            backgroundColor: totalSpent > 18000 ? "#e74c3c" : "#2ecc71",
          }}
        ></div>
      </div>
    </div>
  );
};

export default SpendingChart;
