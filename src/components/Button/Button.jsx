import React from "react";
import "./Button.css";

const Button = ({ onClick, title }) => {
  return (
    <button type="submit" className="add-btn" onClick={onClick}>
      {title}
    </button>
  );
}

export default Button;