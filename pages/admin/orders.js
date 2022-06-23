import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useContext, useReducer } from "react";
import { CircularProgress, List, ListItem, ListItemText } from "@mui/material";

import { getError } from "../../utils/error";
import { Store } from "../../utils/Store";
import Layout from "../../components/Layout";

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

function AdminOrders() {
  const { state } = useContext(Store);
  const router = useRouter();

  const { userInfo } = state;

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: "",
  });

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get("/api/admin/orders", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <Layout title="Órdenes">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 min-h-screen">
          <div className="w-full h-fit">
            <div className="card p-6">
              <List>
                <Link href="/admin/dashboard" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="Administración Dashboard"></ListItemText>
                  </ListItem>
                </Link>
                <Link href="/admin/orders" passHref>
                  <ListItem selected button component="a">
                    <ListItemText primary="Órdenes"></ListItemText>
                  </ListItem>
                </Link>
                <Link href="/admin/products" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="Productos"></ListItemText>
                  </ListItem>
                </Link>
                <Link href="/admin/users" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="Usuarios"></ListItemText>
                  </ListItem>
                </Link>
              </List>
            </div>
          </div>

          <div className="col-span-3">
            <div className="card w-full p-6">
              <ul>
                <li>
                  <h1 className="text-4xl py-4">Órdenes</h1>
                </li>

                <li>
                  {loading ? (
                    <CircularProgress />
                  ) : error ? (
                    <p>{error}</p>
                  ) : (
                    <div>
                      <div className="w-full bg-gray-100">
                        <div className="w-full text-lg font-bold flex flex-row flex-wrap justify-between invisible md:visible">
                          <p className="py-2">ID</p>
                          <p className="py-2">USUARIO</p>
                          <p className="py-2">FECHA</p>
                          <p className="py-2">TOTAL</p>
                          <p className="py-2">PAGO</p>
                          <p className="py-2">ENTREGA</p>
                          <p className="py-2">ACCION</p>
                        </div>
                      </div>
                      <div>
                        {orders.map((order) => (
                          <div
                            key={order._id}
                            className="md:flex md:flex-row md:justify-items-stretch md:justify-between px-2 py-6"
                          >
                            <div className="flex justify-between bg-amber-100">
                              <span className="md:order-2 visible md:invisible">
                                ID
                              </span>
                              <p className="md:order-1">
                                {order._id.substring(20, 24)}
                              </p>
                            </div>

                            <div className="flex justify-between basis-1/6 bg-pink-100">
                              <span className="md:order-2 visible md:invisible">
                                USUARIO
                              </span>

                              <p className="md:order-1 text-2xl md:text-base">
                                {order.user
                                  ? order.user.name
                                  : "ELIMINAR USUARIO"}
                              </p>
                            </div>

                            <div className="flex justify-between basis-1/6 bg-orange-100">
                              <span className="md:order-2 visible md:invisible">
                                FECHA
                              </span>

                              <p className="md:order-1 text-2xl md:text-base">
                                {order.createdAt.substring(0, 10)}
                              </p>
                            </div>

                            <div className="flex justify-between basis-1/6 bg-purple-100">
                              <span className="md:order-2 visible md:invisible">
                                TOTAL
                              </span>

                              <p className="md:order-1 text-2xl font-semibold">
                                ${order.totalPrice}
                              </p>
                            </div>

                            <div className="flex justify-between basis-1/6 bg-sky-100">
                              <span className="md:order-2 visible md:invisible">
                                PAGO
                              </span>

                              <p className="md:order-1 text-2xl md:text-base">
                                {order.isPaid
                                  ? `${order.paidAt.substring(0, 10)}`
                                  : "sin pago"}
                              </p>
                            </div>

                            <div className="flex justify-between basis-1/6 bg-emerald-100">
                              <span className="md:order-2 visible md:invisible">
                                ENTREGA
                              </span>

                              <p className="md:order-1 text-2xl md:text-base">
                                {order.isDelivered
                                  ? `${order.deliveredAt.substring(0, 10)}`
                                  : "sin entrega"}
                              </p>
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

export default dynamic(() => Promise.resolve(AdminOrders), { ssr: false });
