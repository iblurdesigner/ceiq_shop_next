import React from "react";

export default function Userbtn({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      alt="boton usuario"
      title="boton usuario"
      description="boton usuario"
      aria-describedby="boton-de-usuario"
      data-test="usericon-button"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
