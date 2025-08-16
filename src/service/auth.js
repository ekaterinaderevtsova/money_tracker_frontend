class AuthService {
  constructor() {
    this.baseURL = "https://vocabvaultapp.duckdns.org/money-tracker/auth"; // Update with your backend URL
    this.accessToken = localStorage.getItem("access_token");
  }

  async login(credentials) {
    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for cookies
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      console.log("Login response:", data);

      this.accessToken = data.access_token;
      localStorage.setItem("access_token", this.accessToken);

      console.log("Token saved in memory:", this.accessToken);

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async refresh() {
    try {
      const response = await fetch(`${this.baseURL}/refresh`, {
        method: "POST",
        credentials: "include", // Important for sending refresh token cookie
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      this.accessToken = data.AccessToken;
      localStorage.setItem("access_token", this.accessToken);

      return data;
    } catch (error) {
      console.error("Token refresh error:", error);
      this.logout(); // Clear tokens if refresh fails
      throw error;
    }
  }

  logout() {
    this.accessToken = null;
    localStorage.removeItem("access_token");
    // Optionally call a logout endpoint to clear the refresh token cookie
  }

  isAuthenticated() {
    return !!this.accessToken;
  }

  getAccessToken() {
    return this.accessToken;
  }

  isTokenExpired() {
    if (!this.accessToken) return true;

    try {
      const payload = JSON.parse(atob(this.accessToken.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  async authenticatedRequest(url, options = {}) {
    const makeRequest = async (token) => {
      console.log("FETCH →", url, "with token:", token);
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    };

    try {
      let response = await makeRequest(this.accessToken);

      // If token expired (401), try to refresh
      if (response.status === 401) {
        await this.refresh();
        response = await makeRequest(this.accessToken);
      }

      return response;
    } catch (error) {
      console.error("Authenticated request failed:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
