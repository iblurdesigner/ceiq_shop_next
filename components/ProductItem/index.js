import React, { Suspense } from "react";
import useNearScreen from "../../hooks/useNearScreen";
import dynamic from "next/dynamic";

const ProductItem = dynamic(() => import("./ProductItem"), { suspense: true });

export default function LazyTrending() {
  const { isNearScreen, fromRef } = useNearScreen({ distance: "100px" });

  return (
    <div ref={fromRef}>
      <Suspense fallback={`Cargando...`}>
        {isNearScreen ? <ProductItem /> : `Cargando...`}
      </Suspense>
    </div>
  );
}
