import React, { useContext } from "react";
import Layout from "../components/Layout";
import ProductItem from "../components/ProductItem";
// import data from '../utils/data';
import axios from "axios";
import db from "../utils/db";
import Product from "../models/Product";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Store } from "../utils/Store";

// Ojo: para evitar el error de la Hydration hay que usar dynamic de next, eliminando la exportacion por defecto de la funcion CartScreen

function Home(props) {
  // Ya no necesitaremos pedir desde la base de datos estatica si no mediante las props
  const { products } = props;
  const router = useRouter();
  const { state, dispatch } = useContext(Store);

  const addToCartHandler = async (product) => {
    // esto es para sumar un item adicional si ya estaba en el carrito
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Lo sentimos. La cantidad que solicita sobrepasa el stock");
      return;
    }

    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    router.push("/cart");
  };

  return (
    <Layout title="Pagina de inicio">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem
            product={product}
            key={product.slug}
            addToCartHandler={addToCartHandler}
          ></ProductItem>
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({}, "-reviews").lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}

// esto es para evitar el error de Hydration
export default dynamic(() => Promise.resolve(Home), { ssr: false });
