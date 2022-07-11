import React, { Suspense, useState, useEffect } from "react";
import useNearScreen from "../../hooks/useNearScreen";
import dynamic from "next/dynamic";
import getBlockchain from "../../components/ethereum.js";

const StoreEth = dynamic(() => import("./StoreEth"), { suspense: true });

export default function LazyTrending() {
  const [paymentProcessor, setPaymentProcessor] = useState(undefined);
  const [dai, setDai] = useState(undefined);
  const { isNearScreen, fromRef } = useNearScreen({ distance: "100px" });
  useEffect(() => {
    // crypto
    const init = async () => {
      const { paymentProcessor, dai } = await getBlockchain();
      setPaymentProcessor(paymentProcessor);
      setDai(dai);
    };
    init();
  }, []);

  return (
    <div ref={fromRef}>
      <Suspense fallback={`Cargando...`}>
        {isNearScreen ? (
          <StoreEth paymentProcessor={paymentProcessor} dai={dai} />
        ) : (
          `Cargando...`
        )}
      </Suspense>
    </div>
  );
}
