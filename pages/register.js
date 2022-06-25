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

export default function Register() {
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

  const submitHandler = async ({ name, email, password, confirmPassword }) => {
    closeSnackbar();
    if (password !== confirmPassword) {
      enqueueSnackbar("Las contraseñas no son las mismas", {
        variant: "error",
      });
      return;
    }

    try {
      const { data } = await axios.post("/api/users/register", {
        name,
        email,
        password,
      });
      dispatch({ type: "USER_LOGIN", payload: data });
      Cookies.set("userInfo", JSON.stringify(data));
      router.push(redirect || "/");
      // alert('Inicio de sesión con exito!');
    } catch (err) {
      enqueueSnackbar(getError(err), {
        variant: "error",
      });
    }
  };

  return (
    <Layout title="Registro">
      <div className="flex justify-center">
        <div className="card w-4/12 ">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="rounded px-8 pt-6 pb-8 mb-4"
          >
            <h1 className="text-4xl py-4">Registro</h1>
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
                    pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
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
                    required: true,
                    minLength: 6,
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
                <Controller
                  name="confirmPassword"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
                    minLength: 6,
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
                        errors.confirmPassword
                          ? errors.confirmPassword.type === "minLength"
                            ? "La confirmación de contraseña debe ser mayor a 5 caracteres"
                            : "La confirmación de contraseña es requerida"
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
                  Registrar
                </button>
              </ListItem>
              <ListItem>
                <p className="mx-2">¿Ya tienes una cuenta?</p>
                <Link href={`/login?redirect=${redirect || "/"}`} passHref>
                  <a className="text-green">Ingresar</a>
                </Link>
              </ListItem>
            </List>
          </form>
        </div>
      </div>
    </Layout>
  );
}
