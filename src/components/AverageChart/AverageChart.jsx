import "../SpendingChart/SpendingChart.css";
import PropTypes from "prop-types";

const AverageChart = ({ averageSpent }) => {
  const LIMIT = 2500;
  return (
    <div>
      <div className="chart-labels">
        <span>{averageSpent} din</span>
        <span>{LIMIT} din</span>
      </div>
      <div className="chart-bar">
        <div
          className="chart-progress"
          style={{
            width: `${Math.min((averageSpent / LIMIT) * 100, 100)}%`,
            backgroundColor: averageSpent > LIMIT ? "#e74c3c" : "#3498db",
          }}
        ></div>
      </div>
    </div>
  );
};

AverageChart.propTypes = {
  averageSpent: PropTypes.number.isRequired,
};

export default AverageChart;
