import React from "react";
import "./SpendingList.css";

const SpendingList = ({ spending = [] }) => {
  console.log("SpendingList received:", spending); // Для отладки

  return (
    <div className="weekly-spending-list">
      {spending.map((item, index) => (
        <div key={`${item.date}-${index}`} className="spending-item">
          <div className="item-left">
            <div>{item.dayOfWeek}</div>
            <div>{item.date}</div>
          </div>
          <div className="item-right">{item.amount} din</div>
        </div>
      ))}
    </div>
  );
};

export default SpendingList;
