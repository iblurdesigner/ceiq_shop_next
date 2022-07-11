import React, { useEffect } from "react";
import jQuery from "jquery";

export default function PagoPlux({ className }) {
  const $ = jQuery;
  useEffect(() => {
    console.log($("esta activo el jquery"));
  }, []);

  const handleClick = async (response) => {
    // console.log($('#ButtonPaybox'));

    const response2 = await fetch("https://apipre.pagoplux.com/transv1", {
      method: "POST",
      body: JSON.stringify({
        date: response.detail.fecha, // fecha de resultado de la autorización,
        amount: response.detail.amount, // Monto de la transaccion,
        token: response.detail.token, // Token de autorización
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response2.json();
    console.log(data);
  };

  return (
    <button
      type="button"
      id="ButtonPaybox"
      className={`dark:text-black text-white bg-indigo-500 rounded-full px-3 py-1 shadow-xl hover:bg-yellow ${className}`}
      onClick={handleClick}
    >
      PagoPlux
    </button>
  );
}
