import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

export default function CheckoutFormStripe({ totalPrice }) {
  let amount = totalPrice;
  amount = Math.round(amount.toFixed(2) * 100);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      <button
        disabled={!stripe}
        className="dark:text-black text-white bg-indigo-500 rounded-full px-3 py-1 shadow-xl hover:bg-yellow text-lg mt-8 font-bold w-full"
      >
        Pagar con Stripe
      </button>
    </form>
  );
}
