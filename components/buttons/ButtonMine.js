import React from "react";

const ButtonMine = ({ children, className, onClick }) => {
  return (
    <button
      className={`bg-green dark:text-blue rounded-full px-3 py-1 shadow-xl hover:bg-yellow  ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ButtonMine;
