import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

export default function Layout({ title, description, children }) {
  return (
    <>
      <Head>
        <title>{title ? title + ' - CEIQ Shop' : 'CEIQ Shop'}</title>
        {description && <meta name="description" content={description} />}

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen flex-col justify-between ">
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
              <Link href="/cart">
                <a className="p-2">Carrito</a>
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
