import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useContext, useReducer } from "react";
import { CircularProgress, List, ListItem, ListItemText } from "@mui/material";
import { getError } from "../utils/error";
import { Store } from "../utils/Store";
import Layout from "../components/Layout";

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

function OrderHistory() {
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
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 min-h-screen">
          <div>
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
            <div className="card p-6">
              <ul>
                <li>
                  <h1 className="text-4xl py-4">Historial de compras</h1>
                </li>
                <li>
                  {loading ? (
                    <CircularProgress />
                  ) : error ? (
                    <p>{error}</p>
                  ) : (
                    <table className="table-fixed tableInfo">
                      <thead>
                        <tr>
                          <th className="py-2">ID</th>
                          <th className="py-2">FECHA</th>
                          <th className="py-2">TOTAL</th>
                          <th className="py-2">PAGO</th>
                          <th className="py-2">ENTREGA</th>
                          <th className="py-2">ACCION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr
                            key={order._id}
                            className="divide-y divide-sky-300"
                          >
                            <td className="py-6">
                              {order._id.substring(20, 24)}
                            </td>
                            <td>{order.createdAt}</td>
                            <td>${order.totalPrice}</td>
                            <td>
                              {order.isPaid
                                ? `pagado el ${order.paidAt}`
                                : "sin pago"}
                            </td>
                            <td>
                              {order.isDelivered
                                ? `entregado en ${order.deliveredAt}`
                                : "sin entrega"}
                            </td>
                            <td>
                              <Link href={`/order/${order._id}`} passHref>
                                <button className="bg-green rounded-full px-3 py-1 shadow-xl hover:bg-yellow">
                                  Detalles
                                </button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Layout>

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
  );
}

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false });
