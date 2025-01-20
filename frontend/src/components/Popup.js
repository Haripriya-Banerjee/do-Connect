import React from "react";
import "./pop.css"

const Popup = ({message, onClose}) => {
    return (
        <div className='modal'>
            <div>{message}</div>
            <button onClick={onClose}>Close</button>
        </div>
      )
};

export default Popup;