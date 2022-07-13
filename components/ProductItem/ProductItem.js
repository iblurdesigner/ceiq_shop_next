/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Rating } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

function ProductItem({ product, addToCartHandler }) {
  return (
    <>
      <div className="card">
        <div className="h-full grid grid-cols-1 content-between">
          <div>
            <Link href={`/product/${product.slug}`} passHref>
              <a>
                <Image
                  src={product.image}
                  placeholder="blur"
                  blurDataURL={product.image}
                  quality={50}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="rounded-t-lg shadow"
                  layout="responsive"
                  objectFit="contain"
                />
              </a>
            </Link>
          </div>

          <div className="grid content-between p-4">
            <Link href={`/product/${product.slug}`} passHref>
              <a>
                <h2
                  data-test="name-productitem"
                  className="dark:text-white text-xl font-medium text-blue hover:text-cyan pb-2"
                >
                  {product.name}
                </h2>
                <ul>
                  <li className="flex items-center">
                    <Rating value={product.rating} readOnly></Rating>
                    <Link href="#reviews" passHref>
                      <p className="text-sky-500 ml-4 font-bold">
                        {product.numReviews} revisiones
                      </p>
                    </Link>
                  </li>
                </ul>
              </a>
            </Link>
            <p className="mb-2 text-gray-600">{product.brand}</p>
            <p className="text-3xl font-semibold h-12">
              <span className="font-normal text-base">US$</span>
              {product.price}
            </p>

            <button
              className="bg-green rounded-full font-medium text-lg px-4 py-2 shadow-xl hover:bg-yellow hover:text-white w-full"
              type="button"
              onClick={() => addToCartHandler(product)}
            >
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function areEqual(prevProps, nextProps) {
  return prevProps.product === nextProps.product;
}

export default React.memo(ProductItem, areEqual);
