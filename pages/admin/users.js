import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useContext, useReducer } from "react";
import { CircularProgress, List, ListItem, ListItemText } from "@mui/material";

import { getError } from "../../utils/error";
import { Store } from "../../utils/Store";
import Layout from "../../components/Layout";
import { useSnackbar } from "notistack";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, users: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
  }
}

function AdminUsers() {
  const { state } = useContext(Store);
  const router = useRouter();

  const { userInfo } = state;

  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      users: [],
      error: "",
    });

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get("/api/admin/users", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [successDelete]);

  // ***** para crear un usuario y para eliminarlo ******
  const { enqueueSnackbar } = useSnackbar();

  const deleteHandler = async (userId) => {
    if (!window.confirm("Está seguro de realizar esta acción?")) {
      return;
    }
    try {
      dispatch({ type: "DELETE_REQUEST" });
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: "DELETE_SUCCESS" });
      enqueueSnackbar("Usuario eliminado con exito", { variant: "success" });
    } catch (err) {
      dispatch({ type: "DELETE_FAIL" });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  // ***** para crear un usuario y para eliminarlo ******

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
                  <ListItem selected button component="a">
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
                  <h1 className="text-4xl dark:text-cyan py-4">Usuarios</h1>
                  {loadingDelete && <CircularProgress />}
                </li>

                <li>
                  {loading ? (
                    <CircularProgress />
                  ) : error ? (
                    <p>{error}</p>
                  ) : (
                    <>
                      <div className="w-full dark:bg-transparent bg-gray-100">
                        <div className="w-full text-lg font-bold flex flex-row flex-wrap justify-between invisible md:visible">
                          <p className="py-2">ID</p>
                          <p className="py-2">NOMBRE</p>
                          <p className="py-2">EMAIL</p>
                          <p className="py-2">ADMINISTRADOR</p>
                          <p className="basis-2/6 py-2">ACCIONES</p>
                        </div>
                      </div>
                      <div>
                        {users.map((user) => (
                          <div
                            key={user._id}
                            className="card md:flex md:flex-row md:justify-items-stretch md:justify-between px-2 py-6"
                          >
                            <div className="flex justify-between">
                              <p className="md:order-2 visible md:invisible">
                                ID
                              </p>
                              <p className="md:order-1">
                                {user._id.substring(20, 24)}
                              </p>
                            </div>

                            <div className="flex justify-between ">
                              <p className="md:order-2 text-sm visible md:invisible">
                                NOMBRE
                              </p>
                              <p className="md:order-1 text-2xl md:text-base">
                                {user.name}
                              </p>
                            </div>

                            <div className="flex justify-between">
                              <p className="md:order-2 text-sm visible md:invisible">
                                EMAIL
                              </p>
                              <p className="md:order-1 text-2xl md:text-base">
                                {user.email}
                              </p>
                            </div>

                            <div className="flex justify-between">
                              <p className="md:order-2 text-sm visible md:invisible">
                                ADMINISTRADOR
                              </p>
                              <p className="md:order-1 text-2xl md:text-base">
                                {user.isAdmin ? "SI" : "NO"}
                              </p>
                            </div>

                            <div className="flex justify-between basis-2/6">
                              <Link href={`/admin/user/${user._id}`} passHref>
                                <button className="bg-cyan w-full mt-4 md:mr-2  rounded-full px-3 py-1 shadow-xl hover:bg-green">
                                  Editar
                                </button>
                              </Link>{" "}
                              <button
                                onClick={() => deleteHandler(user._id)}
                                className="bg-red-400 w-full mt-4  rounded-full px-3 py-1 shadow-xl hover:bg-red-200"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
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

export default dynamic(() => Promise.resolve(AdminUsers), {
  ssr: false,
});
