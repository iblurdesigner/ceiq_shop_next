import React, { Suspense } from "react";
import useNearScreen from "../../hooks/useNearScreen";
import dynamic from "next/dynamic";

const StoreEth = dynamic(() => import("./StoreEth"), { suspense: true });

export default function LazyTrending() {
  const { isNearScreen, fromRef } = useNearScreen({ distance: "100px" });

  return (
    <div ref={fromRef}>
      <Suspense fallback={`Cargando...`}>
        {isNearScreen ? <StoreEth /> : `Cargando...`}
      </Suspense>
    </div>
  );
}
