import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
const CartBtn = dynamic(() => import("../components/buttons/CartBtn"), {
  suspense: true,
});

export default function Cart({ cart }) {
  return (
    <Link href="/cart" passHref>
      <a className="p-2 md:visible" title="boton carrito de compras">
        <div className="flex">
          <CartBtn
            alt="boton carrito de compras"
            className="text-white h-6 w-6"
          />
          {cart.cartItems.length > 0 && (
            <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
              {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
            </span>
          )}
        </div>
      </a>
    </Link>
  );
}
