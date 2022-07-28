import React, { useContext, useEffect, useState } from "react";
import CheckoutWizard from "../components/CheckoutWizard";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Store } from "../utils/Store";
import Layout from "../components/Layout";
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
      <CheckoutWizard activestep={2}></CheckoutWizard>
      <form className="rounded px-8 pt-6 pb-8 mb-4" onSubmit={submitHandler}>
        <h1 data-test="title" className="text-4xl py-4">
          Método de pago
        </h1>
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
                  data-test="paypal"
                  label="PayPal"
                  value="PayPal"
                  control={<Radio className="dark:bg-gray-50" />}
                ></FormControlLabel>
                <FormControlLabel
                  data-test="plux"
                  label="Stripe"
                  value="Stripe"
                  control={<Radio className="dark:bg-gray-50" />}
                ></FormControlLabel>
                <FormControlLabel
                  data-test="plux"
                  label="PagoPlux"
                  value="PagoPlux"
                  control={<Radio className="dark:bg-gray-50" />}
                ></FormControlLabel>
                <FormControlLabel
                  data-test="efectivo"
                  label="Efectivo"
                  value="Cash"
                  control={<Radio className="dark:bg-gray-50" />}
                ></FormControlLabel>
                <FormControlLabel
                  data-test="crypto"
                  label="Crytomonedas - Ethereum"
                  value="Ethereum"
                  control={<Radio className="dark:bg-gray-50" />}
                ></FormControlLabel>
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <button
              data-test="continue-button"
              className="dark:text-black bg-green rounded-full w-full md:w-1/2 mt-10 px-3 py-1 shadow-xl hover:bg-yellow"
              type="submit"
            >
              Continuar
            </button>
          </ListItem>
          <ListItem>
            <button
              data-test="back-button"
              className="dark:text-black bg-gray-200 w-1/2 rounded-full mt-10 px-3 py-1 hover:bg-yellow"
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
