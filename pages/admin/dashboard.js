import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import React, {
  useEffect,
  useContext,
  useReducer,
  useState,
  useRef,
} from "react";
import { CircularProgress, List, ListItem, ListItemText } from "@mui/material";
import { getError } from "../../utils/error";
import { Store } from "../../utils/Store";
import Layout from "../../components/Layout";
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
import ButtonMine from "../../components/buttons/ButtonMine";

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

export default function AdminDashboard() {
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

  function BarChart() {
    const initialDates = summary.salesData.map((x) => x._id);
    const initialDataPoints = summary.salesData.map((x) => x.totalSales);

    const [dates, setDates] = useState(initialDates);
    const [dataPoints, setDataPoints] = useState(initialDataPoints);

    console.log("inital Dates: ", initialDates);
    console.log("inital data points: ", initialDataPoints);

    console.log("Dates y Datapoints", dates, dataPoints);

    const inputRef1 = useRef();
    const inputRef2 = useRef();

    function filterData() {
      const dates2 = [...dates];
      const dataPoints2 = [...dataPoints];

      // slice the array
      const value1 = inputRef1.current.value;
      const value2 = inputRef2.current.value;
      const indexstartdate = dates2.indexOf(value1);
      const indexenddate = dates2.indexOf(value2);
      console.log(indexstartdate);
      console.log(indexenddate);
      // slice the array
      const filterDate = dates2.slice(indexstartdate, indexenddate + 1);
      const filterDataPoints = dataPoints2.slice(
        indexstartdate,
        indexenddate + 1
      );

      console.log(filterDate, filterDataPoints);

      setDates(filterDate);
      setDataPoints(filterDataPoints);
      console.log(dates, dataPoints);

      console.log("nueva sumary", summary);
    }

    return (
      <div>
        <div>
          <Bar
            id="myChart"
            data={{
              labels: dates,

              datasets: [
                {
                  label: "Ventas por mes",
                  data: dataPoints,
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                  ],
                  borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                  ],
                  borderWidth: 1,
                },
              ],
            }}
            height={400}
            width={400}
            options={{
              maintainAspectRatio: false,
            }}
          />
        </div>
        <div className="w-4/6 p-2 mt-4 flex justify-around">
          <input type="month" ref={inputRef1} />
          <input type="month" ref={inputRef2} />
          <ButtonMine onClick={filterData}>Filtrar</ButtonMine>
        </div>
      </div>
    );
  }

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
                  <BarChart summary={summary} />
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
