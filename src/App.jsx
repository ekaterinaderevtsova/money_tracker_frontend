import "./App.css";
import { useEffect, useState } from "react";
import { SpendingService } from "./service/spending";
import { authService } from "./service/auth";
import {
  BiSolidLeftArrow,
  BiSolidRightArrow,
  BiChevronDown,
  BiChevronUp,
  BiLogOut,
} from "react-icons/bi";
import Button from "./components/Button/Button.jsx";
import DateInput from "./components/DateInput/DateInput.jsx";
import SumInput from "./components/SumInput/SumInput.jsx";
import SpendingChart from "./components/SpendingChart/SpendingChart.jsx";
import AverageChart from "./components/AverageChart/AverageChart.jsx";
import SpendingList from "./components/SpendingList/SpendingList.jsx";
import WeekArrow from "./components/WeekArrow/WeekArrow.jsx";
import Login from "./components/Login/Login.jsx";

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}.${month}`;
}

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Existing app state
  const [sum, setSum] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [spending, setSpending] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [averageSpent, setAverageSpent] = useState(0);
  const [displayedDate, setDisplayedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        // Нет токена - сразу на логин
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      authService.accessToken = token;

      try {
        // Проверить не истек ли токен локально
        if (authService.isTokenExpired()) {
          console.log("Token expired, trying to refresh...");
          await authService.refresh();
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.log("Authentication check failed:", error);
        authService.logout();
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const fetchSpendings = async (displayedDate) => {
    try {
      const data = await SpendingService.getSpendings(displayedDate);
      console.log("Fetched data:", data);

      setSpending(data.dailyExpenses);
      setTotalSpent(data.totalAmount);
      setAverageSpent(data.averageDaily);
    } catch (error) {
      console.error("Error fetching spendings:", error);
      if (
        error.message.includes("401") ||
        error.message.includes("authentication")
      ) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSpendings(displayedDate);
    }
  }, [displayedDate, isAuthenticated]);

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

      setSpending(data.dailyExpenses);
      setTotalSpent(data.totalAmount);
      setAverageSpent(data.averageDaily);

      // Reset form and close it after successful submission
      setSum("");
      setIsFormOpen(false);
    } catch (error) {
      console.error("Operation failed:", error);
      // If there's an authentication error, logout
      if (
        error.message.includes("401") ||
        error.message.includes("authentication")
      ) {
        handleLogout();
      }
    }
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    // Reset app state
    setSpending([]);
    setTotalSpent(0);
    setAverageSpent(0);
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "Nunito, sans-serif",
          fontSize: "1.1rem",
          color: "#666",
        }}
      >
        Loading...
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Show main app if authenticated
  return (
    <div className="tracker-page">
      <div className="header-container">
        <header className="header">
          <h2>Money Tracker</h2>
          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "white",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem",
              borderRadius: "4px",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
            }
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            <BiLogOut size={18} />
            Logout
          </button>
        </header>
      </div>
      <main className="main-container">
        <div className="container">
          <div className="toggle-header" onClick={toggleForm}>
            <h3>Add a new spending</h3>
            {isFormOpen ? (
              <BiChevronUp size={20} />
            ) : (
              <BiChevronDown size={20} />
            )}
          </div>
          {isFormOpen && (
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
          )}
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
          <div>
            <h4 style={{ marginBottom: "2px" }}>Total Spend</h4>
            <SpendingChart totalSpent={totalSpent} />
          </div>
          <div>
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
