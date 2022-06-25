// import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Layout from "../../components/Layout";
import Product from "../../models/Product";
// import data from '../../utils/data';
import db from "../../utils/db";
import { Store } from "../../utils/Store";
import { getError } from "../../utils/error";
import { useRouter } from "next/router";
import { CircularProgress, Rating, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import dynamic from "next/dynamic";

function ProductScreen(props) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const { product } = props;
  const { enqueueSnackbar } = useSnackbar();

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `/api/products/${product._id}/reviews`,
        {
          rating,
          comment,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      setLoading(false);
      enqueueSnackbar("Las revisiones han sido enviadas correctamente", {
        variant: "success",
      });
      fetchReviews();
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/products/${product._id}/reviews`);
      setReviews(data);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };
  useEffect(() => {
    fetchReviews();
  }, []);

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
          <a className="text-cyan text-xl md:text-lg flex items-center">
            <span className="text-6xl mr-4 md:text-2xl">↞</span>
            <p>Regresar a productos</p>
          </a>
        </Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-1">
          <Image
            src={product.image}
            alt={product.name}
            width={200}
            height={200}
            layout="responsive"
            priority
          ></Image>
        </div>
        <div className="md:col-span-2 md:ml-10 mb-4 mt-4 md:mt-0">
          <ul className="flex flex-col justify-between">
            <li>
              <h1 className="text-4xl md:text-2xl  font-extrabold">
                {product.name}
              </h1>
            </li>
            <li>
              <p className="font-semibold text-lg mt-4">Categoría:</p>
              {product.category}
            </li>
            <li>
              <p className="font-semibold text-lg">Marca:</p>
              {product.brand}
            </li>

            <li className="flex items-center">
              <Rating value={product.rating} readOnly></Rating>
              <Link href="#reviews" passHref>
                <p className="text-cyan font-bold">
                  ({product.numReviews} revisiones)
                </p>
              </Link>
            </li>

            <li>
              <p className="font-semibold text-lg mt-6">Descripción:</p>
              <p>{product.description}</p>
            </li>
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
              className="bg-green dark:text-blue rounded-full w-full px-3 py-1 shadow-xl hover:bg-yellow"
              onClick={addToCartHandler}
            >
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>

      {/* comentarios y revisiones */}
      <ul className="bg-sky-50 mt-8 p-6 md:w-3/6">
        <li>
          <h2
            name="reviews"
            id="reviews"
            className="text-3xl text-gray-400 font-medium mb-4"
          >
            Revisiones de clientes
          </h2>
        </li>
        {reviews.length === 0 && (
          <li>
            <p className="text-gray-400 mb-4">No hay revisiones</p>
          </li>
        )}
        {reviews.map((review) => (
          <li key={review._id} className="my-4">
            <div className="flex flex-row ">
              <div className="px-4">
                <p className="font-bold">{review.name}</p>
                <p className="text-gray-400 font-light text-xs">
                  {review.createdAt.substring(0, 10)}
                </p>
              </div>
              <div className="border-l-2 pl-4 border-sky-200">
                <Rating value={review.rating} readOnly></Rating>
                <p>{review.comment}</p>
              </div>
            </div>
          </li>
        ))}
        <li>
          {userInfo ? (
            <form onSubmit={submitHandler}>
              <ul>
                <li>
                  <p className="text-xl text-cyan mb-4 mt-6">
                    Deja tu comentario
                  </p>
                </li>
                <li className="mb-4">
                  <TextField
                    multiline
                    variant="outlined"
                    fullWidth
                    name="review"
                    label="Ingresar una revisión y calificación"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </li>
                <li className="mb-6">
                  <Rating
                    name="simple-controlled"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </li>
                <li>
                  <button
                    className="bg-green w-3/6 rounded-full px-3 py-1 shadow-xl hover:bg-yellow"
                    type="submit"
                  >
                    Enviar
                  </button>
                  {loading && <CircularProgress></CircularProgress>}
                </li>
              </ul>
            </form>
          ) : (
            <p className="my-6 dark:text-black">
              Por favor{" "}
              <Link href={`/login?redirect=/product/${product.slug}`} passHref>
                <a className="text-cyan hover:text-yellow">Inicie Sesión</a>
              </Link>{" "}
              para escribir una revisión
            </p>
          )}
        </li>
      </ul>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }, "-reviews").lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}

// esto es para evitar el error de Hydration
export default dynamic(() => Promise.resolve(ProductScreen), { ssr: false });
