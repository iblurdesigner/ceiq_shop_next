import { List, ListItem, TextField } from "@mui/material";
import React, { useContext, useEffect } from "react";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { Controller, useForm } from "react-hook-form";
import CheckoutWizard from "../components/CheckoutWizard";
// import CheckoutWizard from '../components/CheckoutWizard';

export default function Shipping() {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  const { location } = shippingAddress;
  useEffect(() => {
    if (!userInfo) {
      router.push("/login?redirect=/shipping");
    }
    setValue("fullName", shippingAddress.fullName);
    setValue("address", shippingAddress.address);
    setValue("city", shippingAddress.city);
    setValue("postalCode", shippingAddress.postalCode);
    setValue("country", shippingAddress.country);
  }, []);

  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, postalCode, country, location },
    });
    Cookies.set(
      "shippingAddress",
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
        location,
      })
    );
    router.push("/payment");
  };

  const chooseLocationHandler = () => {
    const fullName = getValues("fullName");
    const address = getValues("address");
    const city = getValues("city");
    const postalCode = getValues("postalCode");
    const country = getValues("country");
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, postalCode, country },
    });
    Cookies.set("shippingAddress", {
      fullName,
      address,
      city,
      postalCode,
      country,
      location,
    });
    router.push("/map");
  };

  return (
    <Layout title="Dirección de envío">
      <CheckoutWizard activeStep={1}></CheckoutWizard>
      <div className="flex justify-center mt-10">
        <div className="card md:w-8/12 lg:w-6/12 ">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="rounded px-8 pt-6 pb-8 mb-4"
          >
            <h1 className="text-4xl py-4">Dirección de envío</h1>
            <List>
              <ListItem>
                <Controller
                  name="fullName"
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
                      className="dark:bg-gray-50 dark:text-black dark:rounded"
                      id="fullName"
                      label="Nombre completo (Nombre y apellidos)"
                      error={Boolean(errors.fullName)}
                      helperText={
                        errors.fullName
                          ? errors.fullName.type === "minLength"
                            ? "Nombre completo debe contener al menos un caracter"
                            : "Nombre completo es requerido"
                          : ""
                      }
                      {...field}
                    ></TextField>
                  )}
                ></Controller>
              </ListItem>
              <ListItem>
                <Controller
                  name="address"
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
                      className="dark:bg-gray-50 dark:text-black dark:rounded"
                      id="address"
                      label="Dirección"
                      error={Boolean(errors.address)}
                      helperText={
                        errors.address
                          ? errors.address.type === "minLength"
                            ? "La Dirección debe contener al menos un caracter"
                            : "La Dirección es requerida"
                          : ""
                      }
                      {...field}
                    ></TextField>
                  )}
                ></Controller>
              </ListItem>
              <ListItem>
                <Controller
                  name="city"
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
                      className="dark:bg-gray-50 dark:text-black dark:rounded"
                      id="city"
                      label="Ciudad"
                      error={Boolean(errors.city)}
                      helperText={
                        errors.city
                          ? errors.city.type === "minLength"
                            ? "El campo ciudad debe contener al menos un caracter"
                            : "La Ciudad es requerida"
                          : ""
                      }
                      {...field}
                    ></TextField>
                  )}
                ></Controller>
              </ListItem>
              <ListItem>
                <Controller
                  name="postalCode"
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
                      className="dark:bg-gray-50 dark:text-black dark:rounded"
                      id="postalCode"
                      label="Código Postal"
                      error={Boolean(errors.postalCode)}
                      helperText={
                        errors.postalCode
                          ? errors.postalCode.type === "minLength"
                            ? "El campo Código Postal debe contener al menos un caracter"
                            : "El Código Postal es requerido"
                          : ""
                      }
                      {...field}
                    ></TextField>
                  )}
                ></Controller>
              </ListItem>
              <ListItem>
                <Controller
                  name="country"
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
                      className="dark:bg-gray-50 dark:text-black dark:rounded"
                      id="country"
                      label="País"
                      error={Boolean(errors.country)}
                      helperText={
                        errors.country
                          ? errors.country.type === "minLength"
                            ? "El campo País debe contener al menos un caracter"
                            : "El País es requerido"
                          : ""
                      }
                      {...field}
                    ></TextField>
                  )}
                ></Controller>
              </ListItem>

              <ListItem className="flex flex-col">
                <ul>
                  <button
                    className="bg-yellow dark:text-black w-full rounded-full px-3 py-1 shadow-xl hover:bg-green"
                    type="button"
                    onClick={chooseLocationHandler}
                  >
                    Buscar en el mapa
                  </button>
                  <p>{location.lat && `${location.lat}, ${location.lat}`}</p>
                </ul>
                <button
                  className="bg-green dark:text-black mt-10 py-2 px-8 shadow-md w-full rounded-full hover:bg-cyan"
                  type="submit"
                >
                  Continuar
                </button>
              </ListItem>
            </List>
          </form>
        </div>
      </div>
    </Layout>
  );
}
