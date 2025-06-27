import React from "react";
import "./SumInput.css";

const SumInput = ({ sum, handleChange }) => {
  return (
    <input
      type="number"
      min={0}
      className="sum-input"
      placeholder="Enter amount"
      value={sum}
      onChange={handleChange}
    />
  );
}

export default SumInput;