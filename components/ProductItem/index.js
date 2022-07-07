import React, { Suspense } from "react";
import useNearScreen from "hook/useNearScreen";
import dynamic from "next/dynamic";

const ProductItem = dynamic(() => import("./ProductItem"));

export default function LazyTrending() {
  const { isNearScreen, fromRef } = useNearScreen({ distance: "20px" });

  return (
    <div ref={fromRef}>
      <Suspense fallback={`Cargando...`}>
        {isNearScreen ? <ProductItem /> : `Cargando...`}
      </Suspense>
    </div>
  );
}
