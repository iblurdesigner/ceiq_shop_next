import $ from "jquery";
import Link from "next/link";
import { useEffect } from "react";

export default function error404() {
  useEffect(() => {
    console.log($("#prueba"));
  }, []);
  return (
    <>
      <h1 id="prueba" className="dark:text-white text-blue text-3xl">
        Oh no! Ocurrio un error. Pero puedes regresar a buscar productos
      </h1>
      <Link href="/" passHref>
        <a className="text-sky-400"> Ir a comprar</a>
      </Link>
    </>
  );
}
