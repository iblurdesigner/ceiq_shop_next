import Script from "next/script";
import React from "react";

export default function PagoPlux() {
  return (
    <>
      <Script src=" https://code.jquery.com/jquery-3.4.1.min.js" />
      <Script src="https://sandbox-paybox.pagoplux.com/paybox/index.js" />
    </>
  );
}
