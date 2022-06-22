import React from "react";
import { ethers } from "ethers";
import axios from "axios";

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

function StoreEth({ paymentProcessor, dai, className }) {
  const buy = async (item) => {
    const response1 = await axios.get(`${API_URL}/api/getPaymentId/${item.id}`);
    console.log(response1);

    // console.log(paymentProcessor.address);
    // console.log(item.price);

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
    // console.log(response2.data.url);
  };

  return (
    <button
      type="button"
      className={`bg-green rounded-full px-3 py-1 shadow-xl hover:bg-yellow ${className}`}
      onClick={() => buy(ITEMS[0])}
    >
      Pagar en Metamask
    </button>
  );
}

export default StoreEth;
