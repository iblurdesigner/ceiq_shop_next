import React, { Suspense, useContext } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Store } from "../utils/Store";

const ButtonDarkM = dynamic(() => import("../components/buttons/ButtonDarkM"), {
  suspense: true,
});
const SideMenu = dynamic(() => import("./SideMenu"), {
  suspense: true,
});
const Search = dynamic(() => import("./Search"), {
  suspense: true,
});
const UserLogin = dynamic(() => import("./UserLogin"), {
  suspense: true,
});
const Cart = dynamic(() => import("./Cart"), {
  suspense: true,
});

export default function Layout({ title, description, children }) {
  const { state, dispatch } = useContext(Store);
  const { cart, userInfo } = state;

  return (
    <>
      <Head>
        <title>{title ? title + " - CEIQ Shop" : "CEIQ Shop"}</title>
        {description && <meta name="description" content={description} />}

        <link rel="icon" href="/favicon01.svg" />
      </Head>
      <Suspense fallback={`Loading...`}>
        <div className="dark:flex min-h-screen flex-col justify-between">
          <header>
            <nav className="flex navbar items-center px-4 justify-center flex-wrap sm:flex-nowrap md:justify-between shadow-md h-40 md:h-28">
              <SideMenu />
              <div className="lg:w-4/6 flex sm:flex-wrap justify-between items-center md:px-6">
                <Search />
                <div className="invisible md:visible order-3 md:order-2">
                  <ButtonDarkM
                    aria-describedby="boton-modo-oscuro"
                    alt="boton modo oscuro"
                  />
                </div>

                <div className="order-2 md:order-3">
                  <Cart cart={cart} />
                </div>

                <div className="order-last invisible md:visible">
                  <UserLogin
                    className="text-white"
                    dispatch={(dispatch, userInfo)}
                  />
                </div>
              </div>
            </nav>
          </header>
          <main className="container m-auto mt-4 px-4 min-h-screen">
            {children}
          </main>
          <footer className="flex h-10 justify-center items-center shadow-inner">
            <p>Copyright © 2022 CEIQ</p>
          </footer>
        </div>
      </Suspense>
    </>
  );
}
