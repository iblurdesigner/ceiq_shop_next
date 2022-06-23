import React, { useContext } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";
import Link from "next/link";
import Image from "next/image";
import { Select, MenuItem } from "@mui/material";
import dynamic from "next/dynamic";
import axios from "axios";

// Ojo: para evitar el error de la Hydration hay que usar dynamic de next, eliminando la exportacion por defecto de la funcion CartScreen

function CartScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Lo sentimos el producto esta fuera de stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
  };

  // para eliminar items del carrito
  const removeItemHandler = (item) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const checkoutHandler = () => {
    router.push("/shipping");
  };

  return (
    <Layout title="Carrito de compras">
      <h1 className="text-4xl py-4">Carrito de compras</h1>

      {cartItems.length === 0 ? (
        <div>
          El carrito se encuentra vacío.
          <Link href="/" passHref>
            <a className="text-sky-400"> Ir a comprar</a>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 min-h-screen">
            <div className="md:col-span-3">
              <table className="tableInfo table-auto">
                <thead>
                  <tr>
                    <th className="invisible md:visible md:text-lg py-2">
                      Imagen
                    </th>
                    <th className="text-xs md:text-lg py-2">Nombre</th>
                    <th className="text-xs md:text-lg py-2">Cantidad</th>
                    <th className="text-xs md:text-lg py-2">Precio</th>
                    <th className="invisible md:visible text-xs md:text-lg py-2">
                      Acción
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id} className="divide-y  divide-sky-300">
                      <td className="py-6">
                        <Link href={`/product/${item.slug}`} passHref>
                          <a>
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            ></Image>
                          </a>
                        </Link>
                      </td>
                      <td>
                        <Link href={`/product/${item.slug}`} passHref>
                          <a>
                            <p className="text-sky-600">{item.name}</p>
                          </a>
                        </Link>
                      </td>
                      <td>
                        <Select
                          className="h-8 dark:bg-green bg-gray-200 dark:text-black border border-emerald-300   px-4 rounded-full leading-tight"
                          value={item.quantity}
                          onChange={(e) =>
                            updateCartHandler(item, e.target.value)
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <MenuItem key={x + 1} value={x + 1}>
                              {x + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </td>
                      <td>${item.price}</td>
                      <td>
                        <button
                          className="bg-green dark:text-black py-2 px-8 shadow-md rounded-full hover:bg-red-400"
                          type="button"
                          onClick={() => removeItemHandler(item)}
                        >
                          x
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* card */}
            <div className="card h-min">
              <div className="flex flex-col justify-around p-5 gap-y-4">
                <h2 variant="h2">
                  <span className="text-lg font-bold">Subtotal </span>(
                  {cartItems.reduce((a, c) => a + c.quantity, 0)} items) : $
                  {cartItems
                    .reduce((a, c) => {
                      return a + c.quantity * c.price;
                    }, 0)
                    .toFixed(2)}
                </h2>
                <button
                  className="bg-green dark:text-blue rounded-full px-3 py-1 shadow-xl hover:bg-yellow"
                  onClick={checkoutHandler}
                >
                  Pagar
                </button>
              </div>
            </div>
          </div>

          {/* clases con JSX */}
          <style jsx>
            {`
              .tableInfo {
                width: -webkit-fill-available;
              }

              th {
                text-align: initial;
              }
            `}
          </style>
        </>
      )}
    </Layout>
  );
}

// esto es para evitar el error de Hydration
export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
