/* eslint-disable @next/next/no-img-element */
import { Rating } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { Store } from "../utils/Store";

export default function ProductItem({ product }) {
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
      <div className="card">
        <div className="grid grid-cols">
          <Link href={`/product/${product.slug}`} passHref>
            <a>
              <img
                src={product.image}
                alt={product.name}
                className="rounded shadow"
              />
            </a>
          </Link>

          <div className="grid content-between p-4 h-52">
            <Link href={`/product/${product.slug}`} passHref>
              <>
                <a>
                  <h2 className="dark:text-white text-xl font-medium text-blue hover:text-cyan">
                    {product.name}
                  </h2>
                </a>
                <li className="flex items-center">
                  <Rating value={product.rating} readOnly></Rating>
                  <Link href="#reviews" passHref>
                    <p className="text-cyan ml-4 font-bold">
                      {product.numReviews} revisiones
                    </p>
                  </Link>
                </li>
              </>
            </Link>
            <p className="mb-2 text-gray-400">{product.brand}</p>
            <p className="text-3xl font-semibold">
              <span className="font-normal text-base">US$</span>
              {product.price}
            </p>

            <button
              className="bg-green rounded-full font-medium text-lg px-4 py-2 shadow-xl hover:bg-yellow hover:text-white w-full"
              type="button"
              onClick={() => addToCartHandler(product)}
            >
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
