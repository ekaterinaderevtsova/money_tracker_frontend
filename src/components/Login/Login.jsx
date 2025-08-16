import { useState } from "react";
import PropTypes from "prop-types";
import { authService } from "../../service/auth.js";
import Button from "../Button/Button.jsx";

function Login({ onLoginSuccess }) {
  const [credentials, setCredentials] = useState({
    login: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Transform to match backend expected format
      const loginData = {
        Login: credentials.login,
        Password: credentials.password,
      };
      await authService.login(loginData);
      onLoginSuccess();
    } catch (error) {
      setError("Login failed. Please check your credentials.");
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            color: "#434d9a",
          }}
        >
          Login to Money Tracker
        </h2>

        {error && (
          <div
            style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "0.75rem",
              borderRadius: "4px",
              marginBottom: "1rem",
              border: "1px solid #f5c6cb",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              htmlFor="login"
              style={{
                marginBottom: "0.5rem",
                fontWeight: "500",
                color: "#555",
              }}
            >
              Login:
            </label>
            <input
              type="text"
              id="login"
              name="login"
              value={credentials.login}
              onChange={handleChange}
              required
              disabled={isLoading}
              style={{
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem",
                fontFamily: "Nunito, sans-serif",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              htmlFor="password"
              style={{
                marginBottom: "0.5rem",
                fontWeight: "500",
                color: "#555",
              }}
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              style={{
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem",
                fontFamily: "Nunito, sans-serif",
              }}
            />
          </div>

          <div style={{ marginTop: "0.5rem" }}>
            <Button
              title={isLoading ? "Logging in..." : "Login"}
              onClick={handleSubmit}
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

Login.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
};

export default Login;
