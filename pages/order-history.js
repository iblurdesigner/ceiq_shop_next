import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useContext, useReducer } from "react";
import { CircularProgress, List, ListItem, ListItemText } from "@mui/material";
import { getError } from "../utils/error";
import { Store } from "../utils/Store";
import Layout from "../components/Layout";

// Manejador de estado de acuerdo a la acción elegida
function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
  }
}
// Función para mostrar el historial de ordenes registardas en la DB
function OrderHistory() {
  const { state } = useContext(Store);
  const router = useRouter();

  const { userInfo } = state;

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: "",
  });
  // Función para hacer el request de las ordenes
  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
    const fetchOrders = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get("/api/orders/history", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchOrders();
  }, []);

  return (
    <>
      <Layout title="Historial de compras">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 min-h-screen">
          <div className="w-full h-fit">
            <div className="card p-6">
              <List>
                <Link href="/profile" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="Perfil de usuario"></ListItemText>
                  </ListItem>
                </Link>
                <Link href="/order-history" passHref>
                  <ListItem selected button component="a">
                    <ListItemText primary="Historial de ordenes"></ListItemText>
                  </ListItem>
                </Link>
              </List>
            </div>
          </div>

          <div className="col-span-3">
            <div className="card w-full p-6">
              <ul>
                <li>
                  <h1 className="text-4xl dark:text-cyan py-4">
                    Historial de compras
                  </h1>
                </li>

                <li>
                  {loading ? (
                    <CircularProgress />
                  ) : error ? (
                    <p>{error}</p>
                  ) : (
                    <div>
                      <div className="w-full dark:bg-transparent bg-gray-100">
                        <div className="w-full text-lg font-bold flex flex-row flex-wrap justify-between invisible md:visible">
                          <p className="w-10 py-2">ID</p>
                          <p className="basis-1/6 py-2">FECHA</p>
                          <p className="basis-1/6 py-2">TOTAL</p>
                          <p className="basis-1/6 py-2">PAGO</p>
                          <p className="basis-1/6 py-2">ENTREGA</p>
                          <p className="py-2">ACCION</p>
                        </div>
                      </div>
                      <div>
                        {orders.map((order) => (
                          <div
                            key={order._id}
                            className="card md:flex md:flex-row md:justify-items-stretch md:justify-between px-2 py-6"
                          >
                            <div className="flex justify-between dark:bg-transparent bg-amber-100">
                              <span className="md:order-2 visible md:invisible">
                                ID
                              </span>
                              <p className="md:order-1">
                                {order._id.substring(20, 24)}
                              </p>
                            </div>

                            <div className="flex justify-between basis-1/6 dark:bg-transparent bg-pink-100">
                              <span className="md:order-2 visible md:invisible">
                                FECHA
                              </span>
                              <p className="md:order-1 text-2xl md:text-base">
                                {order.createdAt.substring(0, 10)}
                              </p>
                            </div>

                            <div className="flex justify-between basis-1/6 dark:bg-transparent bg-orange-100">
                              <span className="md:order-2 visible md:invisible">
                                TOTAL
                              </span>
                              <p className="md:order-1 text-2xl font-semibold">
                                ${order.totalPrice}
                              </p>
                            </div>

                            <div className="basis-1/6 dark:bg-transparent bg-purple-100">
                              {order.isPaid ? (
                                <div className="flex justify-between">
                                  <span className="md:order-2 visible md:invisible">
                                    PAGO
                                  </span>
                                  <p className="md:order-1 text-2xl md:text-base">
                                    {order.paidAt.substring(0, 10)}
                                  </p>
                                </div>
                              ) : (
                                <div className="flex justify-between">
                                  <span className="md:order-2 visible md:invisible">
                                    PAGO
                                  </span>
                                  <p className="md:order-1 text-2xl md:text-base">
                                    sin pago
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="w-50 text-center dark:bg-transparent bg-sky-100">
                              {order.isDelivered ? (
                                <div className="flex justify-between">
                                  <span className="md:order-2 visible md:invisible">
                                    ENTREGA
                                  </span>
                                  <p className="md:order-1 text-2xl md:text-base">
                                    {order.deliveredAt.substring(0, 10)}
                                  </p>
                                </div>
                              ) : (
                                <div className="flex justify-between">
                                  <span className="md:order-2 visible md:invisible text-xs">
                                    ENTREGA
                                  </span>
                                  <p className="md:order-1 text-2xl md:text-base">
                                    sin entrega
                                  </p>
                                </div>
                              )}
                            </div>

                            <div>
                              <Link href={`/order/${order._id}`} passHref>
                                <button className="bg-green w-full mt-4 md:mt-0 rounded-full px-3 py-1 shadow-xl hover:bg-yellow">
                                  Detalles
                                </button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false });
