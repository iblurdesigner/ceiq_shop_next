import React, { useContext, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { Store } from '../../utils/Store';
import CheckoutWizard from '../../components/CheckoutWizard';
// import Cookies from 'js-cookie';
// import { useSnackbar } from 'notistack';
import Link from 'next/link';
import Image from 'next/image';

import dynamic from 'next/dynamic';
import axios from 'axios';
import { getError } from '../../utils/error';
import { CircularProgress } from '@mui/material';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

// Ojo: para evitar el error de la Hydration hay que usar dynamic de next, eliminando la exportacion por defecto de la funcion CartScreen

function Order({ params }) {
  const orderId = params.id;
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [order]);

  //   const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  return (
    <Layout title={`Orden ${orderId}`}>
      <CheckoutWizard activeStep={3}></CheckoutWizard>
      <h1 className="text-4xl py-4">Orden {orderId}</h1>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <p>{error}</p>
      ) : (
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
                  <li>
                    Estado:{' '}
                    {isDelivered
                      ? `entregado en ${deliveredAt}`
                      : 'Sin entregar'}
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
                  <li>
                    Estado: {isPaid ? `pagado en ${paidAt}` : 'Falta el pago'}
                  </li>
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
                          {orderItems.map((item) => (
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
      )}
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return { props: { params } };
}

//esto es para evitar el error de Hydration
export default dynamic(() => Promise.resolve(Order), { ssr: false });
