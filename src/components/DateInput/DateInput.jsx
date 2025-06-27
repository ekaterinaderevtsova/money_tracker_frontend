import React from "react";
import "./DateInput.css";

const DateInput = ({ date, handleClick }) => {
  return (
    <input
      type="date"
      className="date-input"
      value={date}
      onChange={handleClick}
    />
  );
}

export default DateInput;