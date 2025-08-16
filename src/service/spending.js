import { authService } from "./auth.js";

class SpendingServiceClass {
  constructor() {
    this.baseURL = "https://vocabvaultapp.duckdns.org/money-tracker/expenses"; // Update with your backend URL
  }

  async getSpendings(date) {
    try {
      const response = await authService.authenticatedRequest(
        `${this.baseURL}/weekly?date=${date}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch spendings");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching spendings:", error);
      throw error;
    }
  }

  async addSpending(spendingData) {
    try {
      const response = await authService.authenticatedRequest(
        `${this.baseURL}`,
        {
          method: "POST",
          body: JSON.stringify(spendingData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add spending");
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding spending:", error);
      throw error;
    }
  }
}

export const SpendingService = new SpendingServiceClass();
