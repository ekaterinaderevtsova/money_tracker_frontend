import React from "react";
import "./WeekArrow.css";

const WeekArrow = ({icon: Icon, size, onClick}) => {
    return (
        <div>
            <Icon
                className="weeks-icon"
                size={size}  
                onClick={ onClick }
            />
        </div>
    );
}

export default WeekArrow;