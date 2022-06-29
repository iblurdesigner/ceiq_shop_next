/* eslint-disable @next/next/no-img-element */
import { Rating } from "@mui/material";
import Link from "next/link";

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <>
      <div className="card">
        <div className="h-full grid grid-cols-1 content-between">
          <div>
            <Link href={`/product/${product.slug}`} passHref>
              <a>
                <img
                  src={product.image}
                  alt={product.name}
                  className="rounded-t-lg shadow"
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
                <li className="flex items-center">
                  <Rating value={product.rating} readOnly></Rating>
                  <Link href="#reviews" passHref>
                    <p className="text-cyan ml-4 font-bold">
                      {product.numReviews} revisiones
                    </p>
                  </Link>
                </li>
              </a>
            </Link>
            <p className="mb-2 text-gray-400">{product.brand}</p>
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
