import axios from "axios";
import { useEffect, useState } from "react";

export default function products() {
  const [dataproducts, setDataproducts] = useState([]);
  useEffect(async () => {
    const result = await axios.get(`/api/products/}`);
    setDataproducts(result);
  }, []);
  const products = dataproducts;
  return products;
}
