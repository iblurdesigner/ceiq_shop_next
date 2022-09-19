import { useContext } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { getError } from "../../utils/error";
import { Store } from "../../utils/Store";
import { useSnackbar } from "notistack";

export default function CheckoutFormStripe({ totalPrice, order, userInfo }) {
  const { dispatch } = useContext(Store);
  let amount = totalPrice;
  amount = Math.round(amount.toFixed(2) * 100);
  const stripe = useStripe();
  const elements = useElements();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e, details) => {
    e.preventDefault();

    try {
      dispatch({ type: "PAY_REQUEST" });
      const { data } = await axios.put(
        `/api/orders/${order._id}/pay`,
        details,
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "PAY_SUCCESS", payload: data });
      enqueueSnackbar("Transferencia exitosa! La orden ha sido pagada!", {
        variant: "success",
      });
    } catch (err) {
      dispatch({ type: "PAY_FAIL", payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
    console.log("el token pasado", userInfo.token);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      const { id, type } = paymentMethod;

      try {
        const { data } = await axios.post("/api/checkout_sessions", {
          id,
          type,
          amount,
        });
        console.log(data);

        elements.getElement(CardElement).clear();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button className="dark:text-black text-white bg-indigo-500 rounded-full px-3 py-1 shadow-xl hover:bg-yellow text-lg mt-8 font-bold w-full">
        Pagar con Stripe
      </button>
    </form>
  );
}
