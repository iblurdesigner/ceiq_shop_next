import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { Store } from "../utils/Store";
import Layout from "../components/Layout";
import CheckoutWizard from "../components/CheckoutWizard";
import {
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useSnackbar } from "notistack";

export default function Payment() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("");
  const { state, dispatch } = useContext(Store);
  const {
    cart: { shippingAddress },
  } = state;

  useEffect(() => {
    if (!shippingAddress.address) {
      router.push("/shipping");
    } else {
      setPaymentMethod(Cookies.get("paymentMethod") || "");
    }
  }, []);

  const submitHandler = (e) => {
    closeSnackbar();
    e.preventDefault();
    if (!paymentMethod) {
      enqueueSnackbar("El método de pago es requerido", { variant: "error" });
    } else {
      dispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethod });
      Cookies.set("paymentMethod", paymentMethod);
      router.push("/placeorder");
    }
  };
  return (
    <Layout title="Método de Pago">
      <CheckoutWizard activeStep={2}></CheckoutWizard>
      <form className="rounded px-8 pt-6 pb-8 mb-4" onSubmit={submitHandler}>
        <h1 className="text-4xl py-4">Método de pago</h1>
        <List>
          <ListItem>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="Método de Pago"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  label="PayPal"
                  value="PayPal"
                  control={<Radio />}
                ></FormControlLabel>
                <FormControlLabel
                  label="PagoPlux"
                  value="PagoPlux"
                  control={<Radio />}
                ></FormControlLabel>
                <FormControlLabel
                  label="Efectivo"
                  value="Cash"
                  control={<Radio />}
                ></FormControlLabel>
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <button
              className="dark:text-black bg-green rounded-full px-3 py-1 shadow-xl hover:bg-yellow"
              type="submit"
            >
              Continuar
            </button>
          </ListItem>
          <ListItem>
            <button
              className="dark:text-black bg-gray-200 rounded-full px-3 py-1 hover:bg-yellow"
              type="button"
              onClick={() => router.push("/shipping")}
            >
              Atrás
            </button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
