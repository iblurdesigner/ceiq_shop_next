import Head from 'next/head';
import Link from 'next/link';
import React, { useContext } from 'react';
import Image from 'next/image';
import { Store } from '../utils/Store';

import dynamic from 'next/dynamic';
const ButtonDarkM = dynamic(() => import('./ButtonDarkM'), { ssr: false });

export default function Layout({ title, description, children }) {
  const { state } = useContext(Store);
  const { cart } = state;

  return (
    <>
      <Head>
        <title>{title ? title + ' - CEIQ Shop' : 'CEIQ Shop'}</title>
        {description && <meta name="description" content={description} />}

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="dark:flex min-h-screen flex-col justify-between ">
        <header>
          <nav className="flex h-12 items-center px-4 justify-between shadow-md navbar">
            <Link href="/">
              <a className="text-lg font-bold">
                <Image
                  src="/logo_ceiqShop.svg"
                  width={280}
                  height={64}
                  alt="logo"
                />
              </a>
            </Link>
            <div>
              <ButtonDarkM />
              <Link href="/cart">
                <a className="p-2">
                  Carrito
                  {cart.cartItems.length > 0 && (
                    <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </span>
                  )}
                </a>
              </Link>
              <Link href="/login">
                <a className="p-2">Ingresar</a>
              </Link>
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
        <footer className="flex h-10 justify-center items-center shadow-inner">
          <p>Copyright © 2022 CEIQ</p>
        </footer>
      </div>
    </>
  );
}
