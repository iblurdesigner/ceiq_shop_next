import { ethers } from "ethers";
import axios from "axios";
import { useContext } from "react";
import { getError } from "../../utils/error";
import { Store } from "../../utils/Store";
import { useSnackbar } from "notistack";

const API_URL = "http://localhost:4000";

const ITEMS = [
  {
    id: 1,
    price: ethers.utils.parseEther("10"),
  },
  {
    id: 2,
    price: ethers.utils.parseEther("20"),
  },
];

function StoreEth({ paymentProcessor, dai, totalPrice, order, userInfo, id }) {
  const { dispatch } = useContext(Store);
  let amount = totalPrice;
  amount = Math.round(amount.toFixed(2) * 100);
  const { enqueueSnackbar } = useSnackbar();
  const buy = async (item) => {
    const response1 = await axios.get(`${API_URL}/api/getPaymentId/${item.id}`);
    console.log(response1);
    const tx1 = await dai.approve(paymentProcessor.address, item.price);
    await tx1.wait();

    const tx2 = await paymentProcessor.pay(
      item.price,
      response1.data.paymentId
    );
    await tx2.wait();

    console.log(response1.data.paymentId);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const response2 = await axios.get(
      `${API_URL}/api/getItemUrl/${response1.data.paymentId}`
    );
    console.log(response2);
  };
  // crypto
  if (typeof window.ethereum === "undefined") {
    return <p>Necesita instalar la última versión de Metamask</p>;
  }

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
      // enqueueSnackbar('Transferencia exitosa! La orden ha sido pagada!', {
      //   variant: 'success',
      // });
    } catch (err) {
      dispatch({ type: "PAY_FAIL", payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
    console.log("el token pasado", userInfo.token);

    try {
      const { data } = await axios.post("/api/checkout_sessions", {
        id,

        amount,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-4">
        <button
          className="bg-orange-400 text-white rounded-full px-3 py-1 shadow-xl hover:bg-yellow text-lg mt-8 font-bold w-full"
          onClick={() => buy(ITEMS[0])}
        >
          Pagar con Metamask
        </button>
      </div>
    </form>
  );
}

export default StoreEth;
