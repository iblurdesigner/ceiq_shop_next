import { List, ListItem, TextField } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import React, { useContext, useEffect } from "react";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { getError } from "../utils/error";

export default function Login() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();
  const { redirect } = router.query; // esto es para que redirija a login?redirect=/shipping
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      router.push("/");
    }
  }, []);

  const submitHandler = async ({ email, password }) => {
    closeSnackbar();
    try {
      const { data } = await axios.post("/api/users/login", {
        email,
        password,
      });
      dispatch({ type: "USER_LOGIN", payload: data });
      Cookies.set("userInfo", JSON.stringify(data));
      router.push(redirect || "/");
      // alert('Inicio de sesión con exito!');
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  return (
    <Layout title="Ingreso de usuario al sistema">
      <div className="flex justify-center">
        <div className="card lg:w-4/12 ">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="rounded px-8 pt-6 pb-8 mb-4"
          >
            <h1 className="text-4xl py-4">Ingresar</h1>
            <List>
              <ListItem>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
                    pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                  }}
                  render={({ field }) => (
                    <TextField
                      data-test="email-input"
                      variant="outlined"
                      fullWidth
                      className="dark:bg-gray-50 dark:text-black dark:rounded"
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
                    required: true,
                    minLength: 6,
                  }}
                  render={({ field }) => (
                    <TextField
                      data-test="password-input"
                      variant="outlined"
                      fullWidth
                      className="dark:bg-gray-50 dark:rounded"
                      id="password"
                      label="Contraseña"
                      inputProps={{ type: "password" }}
                      error={Boolean(errors.password)}
                      helperText={
                        errors.password
                          ? errors.password.type === "minLength"
                            ? "La contraseña debe ser mayor a 5 caracteres"
                            : "La contraseña es requerida"
                          : ""
                      }
                      {...field}
                    ></TextField>
                  )}
                ></Controller>
              </ListItem>
              <ListItem>
                <button
                  className="bg-green dark:text-black py-2 px-8 w-full shadow-md rounded-full hover:bg-cyan"
                  type="submit"
                  data-test="submit-button"
                >
                  Ingresar
                </button>
              </ListItem>
              <ListItem>
                <p className="mx-2 dark:text-white">
                  ¿Aún no tienes una cuenta?
                </p>
                <Link href={`/register?redirect=${redirect || "/"}`} passHref>
                  <a className="text-green">Registrarse</a>
                </Link>
              </ListItem>
            </List>
          </form>
        </div>
      </div>
    </Layout>
  );
}
