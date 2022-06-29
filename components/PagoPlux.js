import React from "react";
// import $ from 'jquery';

export default function PagoPlux({ className }) {
  // const data = {
  //   /* Requerido. Email de la cuenta PagoPlux del Establecimiento o Id/Class del elemento html que posee el valor */

  //   PayboxRemail: 'davidisaac.floresmedrano@gmail.com',

  //   /* Requerido. Email del usuario que realiza el pago o Id/Class del elemento html que posee el valor */

  //   PayboxSendmail: '#PayboxSendmail',

  //   /* Requerido. Nombre del establecimiento en PagoPlux o Id/Class del elemento html que posee el valor */

  //   PayboxRename: '#PayboxRename',

  //   /* Requerido. Nombre del usuario que realiza el pago o Id/Class del elemento html que posee el valor */

  //   PayboxSendname: '#PayboxSendname',

  //   /* Requerido. Ejemplo: 100.00, 10.00, 1.00 o Id/Class del elemento html que posee el valor de los productos sin impuestos */

  //   PayboxBase0: '2.70',

  //   /* Requerido. Ejemplo: 100.00, 10.00, 1.00 o Id/Class del elemento html que posee el valor de los productos con su impuesto incluido */

  //   PayboxBase12: '1.50',

  //   /* Requerido. Descripción del pago o Id/Class del elemento html que posee el valor */

  //   PayboxDescription: '#PayboxDescription',

  //   /* Requerido Tipo de Ejecución
  // * Production: true (Modo Producción, Se procesarán cobros y se
  //   cargarán al sistema, afectará a la tdc)
  // * Production: false (Modo Prueba, se realizarán cobros de prueba y no
  //   se guardará ni afectará al sistema)
  // */
  //   PayboxProduction: false,

  //   /* Requerido Ambiente de ejecución
  //    * prod: Modo Producción, Se procesarán cobros y se cargarán al sistema,   afectará a la tdc.
  //    * sandbox: Modo Prueba, se realizarán cobros de prueba
  //    */
  //   PayboxEnvironment: 'sandbox',

  //   /* Requerido. Lenguaje del Paybox
  //    * Español: es | (string) (Paybox en español)
  //    */
  //   PayboxLanguage: 'es',

  //   /* Opcional Valores HTML que son requeridos por la web que implementa
  //   el botón de pago.
  // * Se permiten utilizar los identificadores de # y . que describen los
  //   Id y Class de los Elementos HTML
  // * Array de identificadores de elementos HTML |
  //   Ejemplo: PayboxRequired: ["#nombre", "#correo", "#monto"]
  // */
  //   PayboxRequired: [],

  //   /*
  //    * Requerido. dirección del tarjetahabiente o Id/Class del elemento
  //    * html que posee el valor
  //    */
  //   PayboxDirection: 'dirección de facturación del tarjetahabiente',

  //   /*
  //    * Requerido. Teléfono del tarjetahabiente o Id/Class del elemento
  //    * html que posee el valor
  //    */
  //   PayBoxClientPhone: 'dirección de facturación del tarjetahabiente',

  //   /* Opcionales
  //     *  Solo aplica para comercios que tengan habilitado pagos
  //           internacionales
  //         */
  //   PayBoxClientName: 'Nombre Cliente',
  //   PayBoxClientIdentification: '1010011111',
  //   /* Opcional
  //    * true ->   Se usa en TRUE cuando se necesita enlazar el paybox a un botón ya existente en el sitio del cliente, caso contrario. NOTA: Valor defecto false
  //    */
  //   PayboxPagoPlux: false,

  //   /* Opcional
  //    *  Es requerido solo en el caso de tener PayboxPagoPlux en true se debe especificar el elemento HTML al cual se anclará el click para levantar el Paybox
  //    */
  //   PayboxIdElement: 'ButtonPaybox',
  // };

  // const onAuthorize = (response) => {
  //   // La variable response posee un Objeto con la respuesta de PagoPlux.

  //   if (response.status === 'succeeded') {
  //     // Pago exitoso response contiene la información del pago la cual puede
  //     // usarse para validaciones
  //     return (
  //       {
  //         amount: 7.0,
  //         deferred: 0,
  //         interest: 'SI',
  //         interestValue: 0.23,
  //         amountWoTaxes: 7.0,
  //         taxesValue: 7.0,
  //         cardInfo: 'XXXX XXXX XXXX 0000',
  //         cardIssuer: 'VISA',
  //         cardType: 'credit',
  //         clientID: '1003088679',
  //         clientName: 'CRISTIAN BASTIDAS',
  //         fecha: '2020-08-26 09:40:46',
  //         id_transaccion: '6a574ae6-1',
  //         state: 'PAGADO',
  //         token: '088021-200826-000019',
  //         tipoPago: 'TARJETA',
  //       },
  //       response.detail.token,
  //       response.detail.amount,
  //       response.detail.fecha
  //     );
  //   }
  // };

  // const generateToken = () => {
  //   const longitud = Math.random() * process.env.PAGOPLUX_ID.length;
  //   let cadena = '';
  //   while (cadena.length < longitud) {
  //     cadena += process.env.PAGOPLUX_ID.charAt(Math.random() * longitud);
  //   }
  //   const tiempo = new Date();
  //   let number = tiempo.getTime();
  //   number = number * 30;
  //   // Se cifra en base 64 lo siguiente
  //   // cadena: Cadena randomica generada en base a la ClaveSecreta
  //   // ‘PPX_’: Separador de elementos cifrados
  //   // secretKey: Clave Secreta
  //   // ‘PPX_’: Separador de elementos cifrados
  //   // number:  Timestamp number de la fecha actual del sistema x 30
  //   // ‘AWS’ cadena que identifica ambiente de ejecución
  //   // Se usa función btoa para cifrar todo en base 64 y generar cadena
  //   // básica para header
  //   return btoa(
  //     cadena + 'PPX_' + process.env.PAGOPLUX_ID + 'PPX_' + number + 'AWS'
  //   );
  // };

  return (
    <button
      type="button"
      id="ButtonPaybox"
      className={`dark:text-black text-white bg-indigo-500 rounded-full px-3 py-1 shadow-xl hover:bg-yellow ${className}`}
      onClick={() => {}}
    >
      PagoPlux
    </button>
  );
}
