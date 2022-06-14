/* eslint-disable @next/next/no-img-element */
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
import Carousel from "react-material-ui-carousel";
import Link from "next/link";
import Head from "next/head";

// Ojo: para evitar el error de la Hydration hay que usar dynamic de next, eliminando la exportacion por defecto de la funcion CartScreen

function Home(props) {
  // Ya no necesitaremos pedir desde la base de datos estatica si no mediante las props
  const { topRatedProducts, featuredProducts } = props;
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
    <>
      <Head></Head>

      <Layout title="Pagina de inicio">
        <Carousel animation="slide" className="rounded-lg">
          {featuredProducts.map((product) => (
            <Link key={product._id} href={`/product/${product.slug}`} passHref>
              <a>
                <img src={product.featuredImage} alt={product.name}></img>
              </a>
            </Link>
          ))}
        </Carousel>

        <h1 className="text-2xl font-semibold my-6">Productos más vendidos</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {topRatedProducts.map((product) => (
            <ProductItem
              product={product}
              key={product.slug}
              addToCartHandler={addToCartHandler}
            ></ProductItem>
          ))}
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const featuredProductsDocs = await Product.find(
    { isFeatured: true },
    "-reviews"
  )
    .lean()
    .limit(3);
  const topRatedProductsDocs = await Product.find({}, "-reviews")
    .lean()
    .sort({
      rating: -1,
    })
    .limit(6);
  await db.disconnect();
  return {
    props: {
      featuredProducts: featuredProductsDocs.map(db.convertDocToObj),
      topRatedProducts: topRatedProductsDocs.map(db.convertDocToObj),
    },
  };
}

// esto es para evitar el error de Hydration
export default dynamic(() => Promise.resolve(Home), { ssr: false });
