const data = {
  /* Requerido. Email de la cuenta PagoPlux del Establecimiento o Id/Class del elemento html que posee el valor */

  PayboxRemail: "davidisaac.floresmedrano@gmail.com",

  /* Requerido. Email del usuario que realiza el pago o Id/Class del elemento html que posee el valor */

  PayboxSendmail: "#PayboxSendmail",

  /* Requerido. Nombre del establecimiento en PagoPlux o Id/Class del elemento html que posee el valor */

  PayboxRename: "#PayboxRename",

  /* Requerido. Nombre del usuario que realiza el pago o Id/Class del elemento html que posee el valor */

  PayboxSendname: "#PayboxSendname",

  /* Requerido. Ejemplo: 100.00, 10.00, 1.00 o Id/Class del elemento html que posee el valor de los productos sin impuestos */

  PayboxBase0: "2.70",

  /* Requerido. Ejemplo: 100.00, 10.00, 1.00 o Id/Class del elemento html que posee el valor de los productos con su impuesto incluido */

  PayboxBase12: "1.50",

  /* Requerido. Descripción del pago o Id/Class del elemento html que posee el valor */

  PayboxDescription: "#PayboxDescription",

  /* Requerido Tipo de Ejecución
 * Production: true (Modo Producción, Se procesarán cobros y se 
   cargarán al sistema, afectará a la tdc)
 * Production: false (Modo Prueba, se realizarán cobros de prueba y no  
   se guardará ni afectará al sistema)
*/
  PayboxProduction: false,

  /* Requerido Ambiente de ejecución
   * prod: Modo Producción, Se procesarán cobros y se cargarán al sistema,   afectará a la tdc.
   * sandbox: Modo Prueba, se realizarán cobros de prueba
   */
  PayboxEnvironment: "sandbox",

  /* Requerido. Lenguaje del Paybox
   * Español: es | (string) (Paybox en español)
   */
  PayboxLanguage: "es",

  /* Opcional Valores HTML que son requeridos por la web que implementa  
   el botón de pago.
 * Se permiten utilizar los identificadores de # y . que describen los 
   Id y Class de los Elementos HTML
 * Array de identificadores de elementos HTML | 
   Ejemplo: PayboxRequired: ["#nombre", "#correo", "#monto"]
*/
  PayboxRequired: [],

  /*
   * Requerido. dirección del tarjetahabiente o Id/Class del elemento
   * html que posee el valor
   */
  PayboxDirection: "dirección de facturación del tarjetahabiente",

  /*
   * Requerido. Teléfono del tarjetahabiente o Id/Class del elemento
   * html que posee el valor
   */
  PayBoxClientPhone: "dirección de facturación del tarjetahabiente",

  /* Opcionales
	 *  Solo aplica para comercios que tengan habilitado pagos 
           internacionales
        */
  PayBoxClientName: "Nombre Cliente",
  PayBoxClientIdentification: "1010011111",
  /* Opcional
   * true ->   Se usa en TRUE cuando se necesita enlazar el paybox a un botón ya existente en el sitio del cliente, caso contrario. NOTA: Valor defecto false
   */
  PayboxPagoPlux: false,

  /* Opcional
   *  Es requerido solo en el caso de tener PayboxPagoPlux en true se debe especificar el elemento HTML al cual se anclará el click para levantar el Paybox
   */
  PayboxIdElement: "idHtml",
};

export default function handler(req, res) {
  //   res.status(200).json({
  //     name: 'Api de pago Plux',
  //   });
  if (req.method === "GET") {
    res.status(200).json(data);
  } else if (req.method === "POST") {
    const newpay = {
      date: req.body.date,
      amount: req.body.amount,
      token: req.body.token,
    };
    data.push(newpay);
    res.status(201).json(newpay);
  }
}
