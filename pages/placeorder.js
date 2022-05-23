import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import CheckoutWizard from '../components/CheckoutWizard';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import Link from 'next/link';
import Image from 'next/image';

import dynamic from 'next/dynamic';
import axios from 'axios';
import { getError } from '../utils/error';
import { CircularProgress } from '@mui/material';

// Ojo: para evitar el error de la Hydration hay que usar dynamic de next, eliminando la exportacion por defecto de la funcion CartScreen

function PlaceOrder() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { cartItems, shippingAddress, paymentMethod },
  } = state;

  //calculo de precios
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // esto va a subir a l inmediato superior de 3 decimales
  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
  );
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.12);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  //redireccion
  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, []);

  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const placeOrderHandler = async () => {
    closeSnackbar();
    try {
      setLoading(true);
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: 'CART_CLEAR' });
      Cookies.remove('cartItems');
      setLoading(false);
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title="Realizar Pedido">
      <CheckoutWizard activeStep={3}></CheckoutWizard>
      <h1 className="text-4xl py-4">Realizar Pedido</h1>
      <>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 min-h-screen">
          <div className="col-span-3">
            <div className="card p-6">
              <ul>
                <li>
                  <h2 className="text-2xl mb-2 text-gray-300 font-bold">
                    Dirección de envío
                  </h2>
                </li>
                <li>
                  {shippingAddress.fullName}, {shippingAddress.address},{' '}
                  {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                  {shippingAddress.country}
                </li>
              </ul>
            </div>
            <div className="card p-6">
              <ul>
                <li>
                  <h2 className="text-2xl mb-2 font-bold text-gray-300">
                    Método de Pago
                  </h2>
                </li>
                <li>{paymentMethod}</li>
              </ul>
            </div>
            <div className="card p-6">
              <ul>
                <li>
                  <h2 className="text-2xl font-bold mb-8">Ordenes</h2>
                </li>
                <li>
                  <div>
                    <table className="table-fixed tableInfo">
                      <thead>
                        <tr>
                          <th className="py-2">Imagen</th>
                          <th className="py-2">Nombre</th>
                          <th className="py-2">Cantidad</th>
                          <th className="py-2">Precio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item) => (
                          <tr
                            key={item._id}
                            className="divide-y divide-sky-300"
                          >
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
                              <h2>{item.quantity}</h2>
                            </td>
                            <td>
                              <h2>${item.price}</h2>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <>
            <div className="card h-min">
              <div className="grid grid-flow-row-dense grid-cols-3 p-5 gap-y-4">
                <h2 className="col-span-3 font-bold text-2xl">
                  Resumen del pedido
                </h2>
                <p className="col-span-2 bg-gray-100">Items:</p>
                <p className="text-right bg-sky-50">${itemsPrice}</p>
                <p className="col-span-2 bg-gray-100">Impuesto:</p>
                <p className="text-right bg-sky-50">${taxPrice}</p>

                <p className="col-span-2 bg-gray-100">Envío:</p>
                <p className="text-right bg-sky-50">${shippingPrice}</p>

                <p className="col-span-2 bg-gray-100 text-lg font-bold">
                  Total:
                </p>
                <p className="text-right bg-sky-50 text-lg font-bold">
                  ${totalPrice}
                </p>

                <button
                  className="bg-green rounded-full px-3 py-1 shadow-xl hover:bg-yellow col-span-3"
                  onClick={placeOrderHandler}
                >
                  Realizar Pedido
                </button>
                {loading && (
                  <li>
                    <CircularProgress />
                  </li>
                )}
              </div>
            </div>
          </>
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
    </Layout>
  );
}

//esto es para evitar el error de Hydration
export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false });
