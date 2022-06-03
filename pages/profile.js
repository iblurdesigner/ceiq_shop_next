import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useContext } from "react";
import { List, ListItem, ListItemText, TextField } from "@mui/material";
import { getError } from "../utils/error";
import { Store } from "../utils/Store";
import Layout from "../components/Layout";
import { Controller, useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";

function Profile() {
  const { state, dispatch } = useContext(Store);
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
    }
    setValue("name", userInfo.name);
    setValue("email", userInfo.email);
  }, []);

  const submitHandler = async ({ name, email, password, confirmPassword }) => {
    closeSnackbar();
    if (password !== confirmPassword) {
      enqueueSnackbar("Las contraseñas no son las mismas", {
        variant: "error",
      });
      return;
    }

    try {
      const { data } = await axios.put(
        "/api/users/profile",
        {
          name,
          email,
          password,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "USER_LOGIN", payload: data });
      Cookies.set("userInfo", JSON.stringify(data));

      enqueueSnackbar("Perfil actualizado con exito!", {
        variant: "success",
      });
    } catch (err) {
      enqueueSnackbar(getError(err), {
        variant: "error",
      });
    }
  };

  return (
    <>
      <Layout title="Perfil">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 min-h-screen">
          <div>
            <div className="card p-6">
              <List>
                <Link href="/profile" passHref>
                  <ListItem selected button component="a">
                    <ListItemText primary="Perfil de usuario"></ListItemText>
                  </ListItem>
                </Link>
                <Link href="/order-history" passHref>
                  <ListItem button component="a">
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
                  <h1 className="text-4xl py-4">Perfil de usuario</h1>
                </li>
                <li>
                  <div className="flex justify-center">
                    <div className="card w-8/12 ">
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
                                minLength: 2,
                              }}
                              render={({ field }) => (
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  id="name"
                                  label="Nombre"
                                  inputProps={{ type: "name" }}
                                  error={Boolean(errors.name)}
                                  helperText={
                                    errors.name
                                      ? errors.name.type === "minLength"
                                        ? "El nombre debe ser mayor a 1 caracter"
                                        : "El nombre es requerido"
                                      : ""
                                  }
                                  {...field}
                                ></TextField>
                              )}
                            ></Controller>
                          </ListItem>
                          <ListItem>
                            <Controller
                              name="email"
                              control={control}
                              defaultValue=""
                              rules={{
                                required: true,
                                pattern:
                                  /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                              }}
                              render={({ field }) => (
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  id="email"
                                  label="Email"
                                  inputProps={{ type: "email" }}
                                  error={Boolean(errors.email)}
                                  helperText={
                                    errors.email
                                      ? errors.email.type === "pattern"
                                        ? "El correo no es válido"
                                        : "Es necesario un correo"
                                      : ""
                                  }
                                  {...field}
                                ></TextField>
                              )}
                            ></Controller>
                          </ListItem>
                          <ListItem>
                            <Controller
                              name="password"
                              control={control}
                              defaultValue=""
                              rules={{
                                validate: (value) =>
                                  value === "" ||
                                  value.length > 5 ||
                                  "La contraseña debe ser mayor a 5 caracteres",
                              }}
                              render={({ field }) => (
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  id="password"
                                  label="Contraseña"
                                  inputProps={{ type: "password" }}
                                  error={Boolean(errors.password)}
                                  helperText={
                                    errors.password
                                      ? "La contraseña debe ser mayor a 5 caracteres"
                                      : ""
                                  }
                                  {...field}
                                ></TextField>
                              )}
                            ></Controller>
                          </ListItem>
                          <ListItem>
                            <Controller
                              name="confirmPassword"
                              control={control}
                              defaultValue=""
                              rules={{
                                validate: (value) =>
                                  value === "" ||
                                  value.length > 5 ||
                                  "La confirmación de contraseña debe ser mayor a 5 caracteres",
                              }}
                              render={({ field }) => (
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  id="confirmPassword"
                                  label="Confirmar Contraseña"
                                  inputProps={{ type: "password" }}
                                  error={Boolean(errors.confirmPassword)}
                                  helperText={
                                    errors.password
                                      ? "La confirmación de contraseña debe ser mayor a 5 caracteres"
                                      : ""
                                  }
                                  {...field}
                                ></TextField>
                              )}
                            ></Controller>
                          </ListItem>
                          <ListItem>
                            <button
                              className="bg-green py-2 px-8 shadow-md rounded-full hover:bg-cyan"
                              type="submit"
                            >
                              Actualizar
                            </button>
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

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
