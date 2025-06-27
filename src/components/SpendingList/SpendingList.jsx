import React from "react";
import "./SpendingList.css";

const SpendignList = ({spending}) => {
    return(
        <div className="weekly-spending-list">
        {spending.map((item, index) => (
          <div key={`${item.day}-${index}`} className="spending-item">
            <div className="item-left">
              <div>{item.dayOfWeek}</div>
              <div>{item.date}</div>
            </div>
            <div className="item-right">{item.sum} din</div>
          </div>
        ))}
      </div>
    );
}

export default SpendignList;