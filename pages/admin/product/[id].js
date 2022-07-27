import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useContext, useReducer, useState } from "react";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  TextField,
} from "@mui/material";
import { getError } from "../../../utils/error";
import { Store } from "../../../utils/Store";
import Layout from "../../../components/Layout";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import Image from "next/image";

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

const currencies = [
  {
    value: "Accesorios",
    label: "Accesorios",
  },
  {
    value: "Entrenador Laparoscópico",
    label: "Entrenador Laparoscópico",
  },
  {
    value: "Kits",
    label: "Kits",
  },
  {
    value: "Simuladores",
    label: "Simuladores",
  },
  {
    value: "Skins",
    label: "Skins",
  },
];

function ProductEdit({ params }) {
  const [dataImgUrl, setDataImgUrl] = useState("");
  const [dataImgUrlT, setDataImgUrlT] = useState("");
  const productId = params.id;
  const { state } = useContext(Store);
  const [categoria, setCategoria] = useState("Accesorios");

  const handleCategory = (event) => {
    setCategoria(event.target.value);
  };

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
          const { data } = await axios.get(`/api/admin/products/${productId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          dispatch({ type: "FETCH_SUCCESS" });
          setValue("name", data.name);
          setValue("slug", data.slug);
          setValue("price", data.price);
          setValue("image", data.image);
          setValue("featuredImage", data.featuredImage);
          setIsFeatured(data.isFeatured);
          setValue("category", data.category);
          setValue("brand", data.brand);
          setValue("rating", data.rating);
          setValue("numReviews", data.numReviews);
          setValue("countInStock", data.countInStock);
          setValue("description", data.description);
        } catch (err) {
          dispatch({ type: "FETCH_FAIL", payload: getError(err) });
        }
      };
      fetchData();
    }
  }, []);

  const uploadHandler = async (e, imageField = "image") => {
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
      setValue(imageField, data.secure_url);
      enqueueSnackbar("El archivo se ha subido, actualice por favor", {
        variant: "success",
      });
    } catch (err) {
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  const handlerUrl = (e) => {
    e.preventDefault();
    const referen = document.getElementById("image");
    setDataImgUrl(referen.getAttribute("value"));
  };

  const handlerUrlT = (e) => {
    e.preventDefault();
    const referen = document.getElementById("featuredImage");
    setDataImgUrlT(referen.getAttribute("value"));
  };

  const submitHandler = async ({
    name,
    slug,
    price,
    category,
    image,
    featuredImage,
    brand,
    rating,
    numReviews,
    countInStock,
    description,
  }) => {
    closeSnackbar();

    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/admin/products/${productId}`,
        {
          name,
          slug,
          price,
          category,
          image,
          isFeatured,
          featuredImage,
          brand,
          rating,
          numReviews,
          countInStock,
          description,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      enqueueSnackbar("El Producto se ha actualizado con exito!", {
        variant: "success",
      });
      router.push("/admin/products");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
      enqueueSnackbar(getError(err), {
        variant: "error",
      });
    }
  };

  const [isFeatured, setIsFeatured] = useState(false);

  return (
    <>
      <Layout title={`Editar Producto ${productId}`}>
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
                  <ListItem selected button component="a">
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
                  <h1 className="text-4xl py-4">
                    Editar Producto
                    <p className="text-sm">${productId}</p>
                  </h1>
                </li>
                <li>
                  {loading && <CircularProgress></CircularProgress>}
                  {error && <p>{error}</p>}
                </li>
                <li>
                  <div className="flex justify-center">
                    <div className="card  md:w-8/12 ">
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
                              name="slug"
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
                                  id="slug"
                                  label="Enlace amigable"
                                  error={Boolean(errors.slug)}
                                  helperText={
                                    errors.slug
                                      ? "El enlace amigable es requerido"
                                      : ""
                                  }
                                  {...field}
                                ></TextField>
                              )}
                            ></Controller>
                          </ListItem>
                          <ListItem>
                            <Controller
                              name="price"
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
                                  id="price"
                                  label="Precio"
                                  error={Boolean(errors.price)}
                                  helperText={
                                    errors.price ? "El precio es requerido" : ""
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
                                required: true,
                              }}
                              render={({ field }) => (
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  className="dark:bg-gray-50 dark:rounded"
                                  id="image"
                                  onChange={handlerUrl}
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
                          {dataImgUrl ? (
                            <Image
                              src={dataImgUrl}
                              width={100}
                              height={100}
                            ></Image>
                          ) : (
                            ""
                          )}

                          <ListItem>
                            <Button variant="contained" component="label">
                              Subir imagen
                              <input
                                type="file"
                                onChange={uploadHandler}
                                hidden
                              />
                            </Button>
                            <button
                              className="bg-green dark:text-blue rounded-full ml-4 px-3 py-1 shadow-xl hover:bg-yellow"
                              onClick={handlerUrl}
                            >
                              previsualizar imagen
                            </button>
                            {loadingUpload && <CircularProgress />}
                          </ListItem>
                          <ListItem>
                            <FormControlLabel
                              label="destacada"
                              control={
                                <Checkbox
                                  onClick={(e) =>
                                    setIsFeatured(e.target.checked)
                                  }
                                  checked={isFeatured}
                                  name="isFeatured"
                                  className="dark:bg-white"
                                />
                              }
                            ></FormControlLabel>
                          </ListItem>

                          <ListItem>
                            <Controller
                              name="featuredImage"
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
                                  id="featuredImage"
                                  onChange={handlerUrlT}
                                  label="Foto destacada"
                                  error={Boolean(errors.image)}
                                  helperText={
                                    errors.image
                                      ? "La foto destacada es requerida"
                                      : ""
                                  }
                                  {...field}
                                ></TextField>
                              )}
                            ></Controller>
                          </ListItem>

                          {dataImgUrlT ? (
                            <Image
                              src={dataImgUrlT}
                              width={400}
                              height={100}
                            ></Image>
                          ) : (
                            ""
                          )}

                          <ListItem>
                            <Button variant="contained" component="label">
                              Subir imagen
                              <input
                                type="file"
                                onChange={(e) =>
                                  uploadHandler(e, "featuredImage")
                                }
                                hidden
                              />
                            </Button>
                            <button
                              className="bg-green dark:text-blue rounded-full ml-4 px-3 py-1 shadow-xl hover:bg-yellow"
                              onClick={handlerUrlT}
                            >
                              previsualizar destacada
                            </button>
                            {loadingUpload && <CircularProgress />}
                          </ListItem>

                          <ListItem>
                            <Controller
                              name="category"
                              control={control}
                              defaultValue=""
                              rules={{
                                required: true,
                              }}
                              render={({ field }) => (
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  select
                                  value={categoria}
                                  onChange={handleCategory}
                                  className="dark:bg-gray-50 dark:rounded"
                                  id="category"
                                  label="Categoría"
                                  error={Boolean(errors.category)}
                                  helperText={
                                    errors.category
                                      ? "La Categoría es requerido"
                                      : ""
                                  }
                                  {...field}
                                >
                                  {currencies.map((option) => (
                                    <MenuItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              )}
                            ></Controller>
                          </ListItem>
                          <ListItem>
                            <Controller
                              name="brand"
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
                                  id="brand"
                                  label="Marca"
                                  error={Boolean(errors.brand)}
                                  helperText={
                                    errors.brand ? "La marca es requerido" : ""
                                  }
                                  {...field}
                                ></TextField>
                              )}
                            ></Controller>
                          </ListItem>
                          <ListItem>
                            <Controller
                              name="rating"
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
                                  id="rating"
                                  label="rating"
                                  error={Boolean(errors.rating)}
                                  helperText={
                                    errors.rating
                                      ? "El rating es requerido"
                                      : ""
                                  }
                                  {...field}
                                ></TextField>
                              )}
                            ></Controller>
                          </ListItem>
                          <ListItem>
                            <Controller
                              name="numReviews"
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
                                  id="numReviews"
                                  label="Número de revisiones"
                                  error={Boolean(errors.numReviews)}
                                  helperText={
                                    errors.numReviews
                                      ? "Las revisiones son requeridas"
                                      : ""
                                  }
                                  {...field}
                                ></TextField>
                              )}
                            ></Controller>
                          </ListItem>
                          <ListItem>
                            <Controller
                              name="countInStock"
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
                                  id="countInStock"
                                  label="Cantidad"
                                  error={Boolean(errors.countInStock)}
                                  helperText={
                                    errors.countInStock
                                      ? "La cantidad es requerida"
                                      : ""
                                  }
                                  {...field}
                                ></TextField>
                              )}
                            ></Controller>
                          </ListItem>
                          <ListItem>
                            <Controller
                              name="description"
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
                                  multiline
                                  id="description"
                                  label="Descripción"
                                  error={Boolean(errors.description)}
                                  helperText={
                                    errors.description
                                      ? "La descripción es requerida"
                                      : ""
                                  }
                                  {...field}
                                ></TextField>
                              )}
                            ></Controller>
                          </ListItem>

                          <ListItem>
                            <button
                              className="bg-green dark:text-black py-2 px-8 shadow-md rounded-full hover:bg-cyan"
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

export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false });
