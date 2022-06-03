// import { useRouter } from 'next/router';
import React, { useContext } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Layout from "../../components/Layout";
import Product from "../../models/Product";
// import data from '../../utils/data';
import db from "../../utils/db";
import { Store } from "../../utils/Store";
import { useRouter } from "next/router";

export default function ProductScreen(props) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { product } = props;

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  const addToCartHandler = async () => {
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
    <Layout title={product.name} description={product.description}>
      <div className="py-2">
        <Link href="/" passHref>
          <a>Regresar a productos</a>
        </Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            layout="responsive"
          ></Image>
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg font-extrabold">{product.name}</h1>
            </li>
            <li>Categoría: {product.category}</li>
            <li>Marca: {product.brand}</li>
            <li>
              Calificaciones: {product.rating} estrellas ({product.numReviews}{" "}
              revisiones)
            </li>
            <li>Descripción: {product.description}</li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Precio</div>
              <div>${product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Estado</div>
              <div>
                {product.countInStock > 0 ? "En stock" : "No disponible"}
              </div>
            </div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}
