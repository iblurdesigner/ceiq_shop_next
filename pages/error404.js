import $ from "jquery";
import { useEffect } from "react";

export default function error404() {
  useEffect(() => {
    console.log($("#prueba"));
  }, []);
  return <div id="prueba">error404</div>;
}
