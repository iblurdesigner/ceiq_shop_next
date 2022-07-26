import React from "react";
// import Script from 'next/script';

export default function Prueba() {
  return (
    <>
      {/* <Script id="script-pagoplux" strategy="lazyOnload">
        {`
          const data = {
            PayboxRemail: 'drfernandotorresjaramillo@hotmail.com',
            PayboxSendmail: 'user_ema@doain.com',
            PayboxRename: 'Pago Plux Establecimiento',
            PayboxSendname: 'Nombre Cliente',
            PayboxBase0: '2.7',
            PayboxBase12: '8',
            PayboxDescription: 'Pago Testa',
            PayboxLanguage: 'es',
            PayboxRequired: [],
            PayboxDirection: 'Bolivar 2-80 y borrero',
            PayBoxClientPhone: '0987654321',
            PayboxProduction: false,
            PayBoxClientName: 'Cristian Bastidas',
            PayBoxClientIdentification: '10030',
            PayboxEnvironment: 'sandbox',
            PayboxPagoPlux: true,
            PayboxIdElement: 'idElementoTest',
          };
          `}
      </Script>
      <Script id="script-onAuth" strategy="lazyOnload">
        {`
        const onAuthorize = function (response) {
          if (response.status === 'succeeded') {
            console.log(response);
            alert('Proceso completado con éxito');
          } else {
            alert('Error al procesar el pago');
            console.log(response);
          }
        };
        `}
      </Script> */}

      <div>
        <div>
          <button id="idElementoTest">Pagar Prueba</button>
        </div>
        <div id="ButtonPaybox"></div>
      </div>
    </>
  );
}
