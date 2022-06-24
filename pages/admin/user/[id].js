import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useContext, useState, useReducer } from "react";
import {
  Button,
  Checkbox,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  TextField,
  FormControlLabel,
} from "@mui/material";
import { getError } from "../../../utils/error";
import { Store } from "../../../utils/Store";
import Layout from "../../../components/Layout";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
// import { data } from 'autoprefixer';

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true, errorUpdate: "" };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, errorUpdate: "" };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
  }
}

function UserEdit({ params }) {
  const userId = params.id;
  const { state } = useContext(Store);

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const [isAdmin, setIsAdmin] = useState(false);

  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return router.push("/login");
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: "FETCH_REQUEST" });
          const { data } = await axios.get(`/api/admin/users/${userId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setIsAdmin(data.isAdmin);
          dispatch({ type: "FETCH_SUCCESS" });
          setValue("name", data.name);
        } catch (err) {
          dispatch({ type: "FETCH_FAIL", payload: getError(err) });
        }
      };
      fetchData();
    }
  }, []);

  const uploadHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post("/api/admin/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipar  t/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });
      setValue("image", data.secure_url);
      enqueueSnackbar("El archivo se ha subido, actualice por favor", {
        variant: "success",
      });
    } catch (err) {
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  const submitHandler = async ({
    name,
    // slug,
    // price,
    // category,
    // image,
    // brand,
    // rating,
    // numReviews,
    // countInStock,
    // description,
  }) => {
    closeSnackbar();

    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/admin/users/${userId}`,
        {
          name,
          isAdmin,
          // slug,
          // price,
          // category,
          // image,
          // brand,
          // rating,
          // numReviews,
          // countInStock,
          // description,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      enqueueSnackbar("El usuario se ha actualizado con exito!", {
        variant: "success",
      });
      router.push("/admin/users");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
      enqueueSnackbar(getError(err), {
        variant: "error",
      });
    }
  };

  return (
    <>
      <Layout title={`Editar usuario ${userId}`}>
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
            <div className="card p-6">
              <ul>
                <li>
                  <h1 className="text-4xl py-4">
                    Editar usuario
                    <p className="text-sm">${userId}</p>
                  </h1>
                </li>
                <li>
                  {loading && <CircularProgress></CircularProgress>}
                  {error && <p>{error}</p>}
                </li>
                <li>
                  <div className="flex justify-center">
                    <div className="card md:w-8/12 ">
                      <form
                        onSubmit={handleSubmit(submitHandler)}
                        className="rounded px-8 pt-6 pb-8 mb-4"
                      >
                        <List>
                          <ListItem>
                            <Controller
                              name="name"
                              control={control}
                              defaultValue=""
                              rules={{
                                required: true,
                              }}
                              render={({ field }) => (
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  className="dark:bg-gray-50 dark:rounded"
                                  id="name"
                                  label="Nombre"
                                  error={Boolean(errors.name)}
                                  helperText={
                                    errors.name ? "El nombre es requerido" : ""
                                  }
                                  {...field}
                                ></TextField>
                              )}
                            ></Controller>
                          </ListItem>

                          <ListItem>
                            <Controller
                              name="image"
                              control={control}
                              defaultValue=""
                              rules={{
                                required: false,
                              }}
                              render={({ field }) => (
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  className="dark:bg-gray-50 dark:rounded"
                                  id="image"
                                  label="Imagen"
                                  error={Boolean(errors.image)}
                                  helperText={
                                    errors.image ? "La imagen es requerido" : ""
                                  }
                                  {...field}
                                ></TextField>
                              )}
                            ></Controller>
                          </ListItem>

                          <ListItem>
                            <Button variant="contained" component="label">
                              Subir imagen
                              <input
                                type="file"
                                onChange={uploadHandler}
                                hidden
                              />
                            </Button>
                            {loadingUpload && <CircularProgress />}
                          </ListItem>
                          <ListItem>
                            <FormControlLabel
                              label="Administrador"
                              control={
                                <Checkbox
                                  onClick={(e) => setIsAdmin(e.target.checked)}
                                  checked={isAdmin}
                                  name="Administrador"
                                />
                              }
                            ></FormControlLabel>
                          </ListItem>

                          <ListItem>
                            <button
                              className="bg-green py-2 px-8 shadow-md rounded-full hover:bg-cyan"
                              type="submit"
                            >
                              Actualizar
                            </button>
                            {loadingUpdate && <CircularProgress />}
                          </ListItem>
                        </List>
                      </form>
                    </div>
                  </div>
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

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(UserEdit), { ssr: false });
