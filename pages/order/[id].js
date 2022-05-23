import React, { useContext, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { Store } from '../../utils/Store';

import { useSnackbar } from 'notistack';
import Link from 'next/link';
import Image from 'next/image';

import dynamic from 'next/dynamic';
import axios from 'axios';
import { getError } from '../../utils/error';
import { CircularProgress } from '@mui/material';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };
    default:
      state;
  }
}

// Ojo: para evitar el error de la Hydration hay que usar dynamic de next, eliminando la exportacion por defecto de la funcion CartScreen

function Order({ params }) {
  const orderId = params.id;
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, order, successPay }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      order: {},
      error: '',
    }
  );

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
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, successPay]);

  const { enqueueSnackbar } = useSnackbar();

  // funciones para el pago con paypal
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  // para una vez aprobado
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        enqueueSnackbar('Transferencia exitosa! La orden ha sido pagada!', {
          variant: 'success',
        });
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        enqueueSnackbar(getError(err), { variant: 'error' });
      }
    });
  }

  function onError(err) {
    enqueueSnackbar(getError(err), { variant: 'error' });
  }

  return (
    <Layout title={`Orden ${orderId}`}>
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
                      ? `entregado el ${deliveredAt}`
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
                {!isPaid && (
                  <li>
                    {isPending ? (
                      <CircularProgress />
                    ) : (
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                  </li>
                )}
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
