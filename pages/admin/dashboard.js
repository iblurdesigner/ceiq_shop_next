import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useContext, useReducer } from "react";
import { CircularProgress, List, ListItem, ListItemText } from "@mui/material";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { getError } from "../../utils/error";
import { Store } from "../../utils/Store";
import Layout from "../../components/Layout";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
  }
}

function AdminDashboard() {
  const { state } = useContext(Store);
  const router = useRouter();

  const { userInfo } = state;

  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: "",
  });

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get("/api/admin/summary", {
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
      <Layout title="Dashboard">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 min-h-screen">
          <div className="w-full h-fit">
            <div className="card p-6">
              <List>
                <Link href="/admin/dashboard" passHref>
                  <ListItem selected button component="a">
                    <ListItemText primary="Administración Dashboard"></ListItemText>
                  </ListItem>
                </Link>
                <Link href="/admin/orders" passHref>
                  <ListItem button component="a">
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
                  {loading ? (
                    <CircularProgress />
                  ) : error ? (
                    <p>{error}</p>
                  ) : (
                    <>
                      <div className="grid grid-flow-row md:grid-cols-4 gap-6">
                        <div className="card shadow-2xl p-6">
                          <h1 className="text-4xl py-4">
                            ${summary.ordersPrice}
                          </h1>
                          <p className="text-xl text-cyan pb-10">Ventas</p>
                          <Link href="/admin/orders" passHref>
                            <button className="bg-green rounded-full px-3 py-1 shadow-xl hover:bg-yellow">
                              Ver ventas
                            </button>
                          </Link>
                        </div>

                        <div className="card p-6">
                          <h1 className="text-4xl py-4">
                            {summary.ordersCount}
                          </h1>
                          <p className="text-xl text-cyan pb-10">Órdenes</p>
                          <Link href="/admin/orders" passHref>
                            <button className="bg-green rounded-full px-3 py-1 shadow-xl hover:bg-yellow">
                              Ver órdenes
                            </button>
                          </Link>
                        </div>

                        <div className="card p-6">
                          <h1 className="text-4xl py-4">
                            {summary.productsCount}
                          </h1>
                          <p className="text-xl text-cyan pb-10">Productos</p>
                          <Link href="/admin/products" passHref>
                            <button className="bg-green rounded-full px-3 py-1 shadow-xl hover:bg-yellow">
                              Ver productos
                            </button>
                          </Link>
                        </div>

                        <div className="card p-6">
                          <h1 className="text-4xl py-4">
                            {summary.usersCount}
                          </h1>
                          <p className="text-xl text-cyan pb-10">Usuarios</p>
                          <Link href="/admin/users" passHref>
                            <button className="bg-green rounded-full px-3 py-1 shadow-xl hover:bg-yellow">
                              Ver usuarios
                            </button>
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </li>

                <li>
                  <h1 className="text-4xl py-4">Ventas</h1>
                </li>
                <li>
                  <Bar
                    data={{
                      labels: summary.salesData.map((x) => x._id),
                      datasets: [
                        {
                          label: "Ventas por mes",
                          backgroundColor: "rgba(162, 222, 208, 1)",
                          data: summary.salesData.map((x) => x.totalSales),
                        },
                        {
                          label: "Ventas por año",
                          backgroundColor: "rgba(140, 122, 189, 1)",
                          data: summary.ordersPrice,
                        },
                      ],
                    }}
                    options={{
                      legend: { display: true, position: "right" },
                    }}
                  ></Bar>
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

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });
