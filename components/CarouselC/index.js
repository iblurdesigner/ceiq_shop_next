import React, { Suspense } from "react";
import useNearScreen from "hooks/useNearScreen";
import dynamic from "next/dynamic";

const CarouselC = dynamic(() => import("./CarouselC"), { suspense: true });

export default function LazyTrending() {
  const { isNearScreen, fromRef } = useNearScreen({ distance: "100px" });

  return (
    <div ref={fromRef}>
      <Suspense fallback={`Cargando...`}>
        {isNearScreen ? <CarouselC /> : `Cargando...`}
      </Suspense>
    </div>
  );
}
