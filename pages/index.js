/* eslint-disable @next/next/no-img-element */
import React, { useContext } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import axios from "axios";
import db from "../utils/db";
import Product from "../models/Product";
import { Store } from "../utils/Store";
import Head from "next/head";
import ProductItem from "../components/ProductItem/ProductItem";
import CarouselC from "../components/CarouselC/CarouselC";
import { Helmet } from "react-helmet";

// Ojo: para evitar el error de la Hydration hay que usar dynamic de next, eliminando la exportacion por defecto de la funcion CartScreen
export default function Home({ title, description, ...props }) {
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
      <Head>
        <title>{title ? title + " - CEIQ Shop" : "CEIQ Shop"}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <Helmet>
        <meta
          name="description"
          content="CEIQ Shop, venta de materiales de estudio para estudiantes de medicina, profesionales de la salud, postgradistas y especialistas en áreas quirúrgicas."
        />
        <meta
          name="keywords"
          content="cirugía, medicina, salud, enseñanza quirúrgica"
        />
        <meta property="og:title" content="CEIQ Shop" />
        <meta
          property="og:description"
          content="CEIQ Shop, venta de materiales de estudio para estudiantes de medicina, profesionales de la salud, postgradistas y especialistas en áreas quirúrgicas."
        />
        <meta property="og:url" content="https://ceiq-shop.vercel.app/" />
        <meta property="og:site_name" content="CEIQ Shop" />
        <meta property="og:locale" content="es_ES" />
        <meta property="og:type" content="article" />
      </Helmet>
      <Layout title="Pagina de inicio">
        <CarouselC featuredProducts={featuredProducts} />

        <h1 id="productos-title" className="text-2xl font-semibold my-6">
          Productos más vendidos
        </h1>

        <div
          data-test="div-productitem"
          className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4"
        >
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
    .limit(5);
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

// export const config = {
//   unstable_runtimeJS: false,
// };
