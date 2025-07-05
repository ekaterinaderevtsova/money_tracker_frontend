import "./App.css";
import { useEffect, useState } from "react";
import { SpendingService } from "./service/spending";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import Button from "./components/Button/Button.jsx";
import DateInput from "./components/DateInput/DateInput.jsx";
import SumInput from "./components/SumInput/SumInput.jsx";
import SpendingChart from "./components/SpendingChart/SpendingChart.jsx";
import AverageChart from "./components/AverageChart/AverageChart.jsx";
import SpendingList from "./components/SpendingList/SpendingList.jsx";
import WeekArrow from "./components/WeekArrow/WeekArrow.jsx";

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}.${month}`;
}

function App() {
  const [sum, setSum] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [spending, setSpending] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [averageSpent, setAverageSpent] = useState(0);
  const [displayedDate, setDisplayedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const fetchSpendings = async (displayedDate) => {
    try {
      const data = await SpendingService.getSpendings(displayedDate);
      setSpending(data.daySpendings);
      setTotalSpent(data.total);
      setAverageSpent(data.average);
    } catch (error) {
      console.error("Error fetching spendings:", error);
    }
  };

  useEffect(() => {
    fetchSpendings(displayedDate);
  }, [displayedDate]);

  const handleLeftArrowClick = () => {
    const newDate = new Date(displayedDate);
    newDate.setDate(newDate.getDate() - 7);
    setDisplayedDate(newDate.toISOString().split("T")[0]);
  };

  const handleRightArrowClick = () => {
    const newDate = new Date(displayedDate);
    newDate.setDate(newDate.getDate() + 7);
    setDisplayedDate(newDate.toISOString().split("T")[0]);
  };

  const handleSumChange = (e) => {
    setSum(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sum || sum <= 0) return;

    try {
      await SpendingService.addSpending({
        day: date,
        sum: Number(sum),
      });

      const data = await SpendingService.getSpendings(displayedDate);
      setSpending(data.daySpendings);
      setTotalSpent(data.total);
      setAverageSpent(data.average);
    } catch (error) {
      console.error("Operation failed:", error);
    }
  };

  return (
    <div className="tracker-page">
      <div className="header-container">
        <header className="header">
          <h2>Money Tracker</h2>
        </header>
      </div>
      <main className="main-container">
        <div className="container">
          <h3>Add a new spending</h3>
          <form className="new-spending-form" onSubmit={handleSubmit}>
            <div>
              <SumInput sum={sum} handleChange={handleSumChange} />
            </div>
            <div>
              <DateInput date={date} handleClick={handleDateChange} />
            </div>
            <div>
              <Button title="Add" onClick={handleSubmit} />
            </div>
          </form>
        </div>
        <hr style={{ border: "0.5px solid #ccc" }} />
        <div className="container">
          <div className="weeks-container">
            <WeekArrow
              icon={BiSolidLeftArrow}
              size={12}
              onClick={handleLeftArrowClick}
            />
            <h3>Week Spendings</h3>
            <WeekArrow
              icon={BiSolidRightArrow}
              size={12}
              onClick={handleRightArrowClick}
            />
          </div>
          <div style={{ marginBottom: "5px" }}>
            <h4 style={{ marginBottom: "2px" }}>Total Spend</h4>
            <SpendingChart totalSpent={totalSpent} />
          </div>
          <div style={{ marginBottom: "5px" }}>
            <h4 style={{ marginBottom: "2px" }}>Average per Day</h4>
            <AverageChart averageSpent={averageSpent} />
          </div>

          <div>
            <SpendingList spending={spending} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
