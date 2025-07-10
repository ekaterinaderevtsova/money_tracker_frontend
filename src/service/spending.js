// const API_BASE = " https://29ed8a2f8c7e.ngrok-free.app/spending";
const API_BASE = "https://moneytracker-production-9f46.up.railway.app/spending";

export const SpendingService = {
  async addSpending(newSpending) {
    const response = await fetch(`${API_BASE}/spendings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(newSpending),
    });
    if (!response.ok) throw new Error("Failed to add spending");
    return await response.json();
  },

  async getSpendings(date) {
    const url = `${API_BASE}/spendings?date=${date}`;
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      const text = await response.text(); // читаем текст, даже если ошибка
      console.log("Raw response:", text);
      if (!response.ok) throw new Error("Failed to fetch spendings");
      return JSON.parse(text); // вручную парсим
    } catch (err) {
      console.error("Fetch error:", err);
      throw err;
    }
  },
};
