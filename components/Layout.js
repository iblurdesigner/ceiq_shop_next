import React, { Suspense, useContext, useState } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Menu, MenuItem } from "@mui/material";
import Link from "next/link";
import Userbtn from "../components/buttons/Userbtn";
import LogoCeiq from "./LogoCeiq";

const SideMenu = dynamic(() => import("./SideMenu"), {
  suspense: true,
});

const ButtonDarkM = dynamic(() => import("../components/buttons/ButtonDarkM"), {
  suspense: true,
});
const Search = dynamic(() => import("./Search"), {
  suspense: true,
});

const Cart = dynamic(() => import("./Cart"), {
  suspense: true,
});

export const config = {
  unstable_runtimeJS: false,
};

export default function Layout({ title, description, children }) {
  const { state, dispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);

  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
  };
  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("userInfo");
    Cookies.remove("cartItems");
    Cookies.remove("shippingAddress");
    Cookies.remove("paymentMethod");
    router.push("/");
  };

  return (
    <>
      <Head>
        <title>{title ? title + " - CEIQ Shop" : "CEIQ Shop"}</title>
        {description && <meta name="description" content={description} />}
        <link rel="icon" href="/favicon01.svg" />
      </Head>
      <div className="dark:flex min-h-screen flex-col justify-between">
        <header>
          <nav className="flex navbar items-center px-4 justify-center flex-wrap sm:flex-nowrap md:justify-between shadow-md h-40 md:h-28">
            <Suspense fallback={`Cargando...`}>
              <SideMenu
                props={
                  (logoutClickHandler, logoutClickHandler, loginClickHandler)
                }
              />
            </Suspense>
            <Link href="/" passHref>
              <a
                className="text-lg font-bold"
                title="logo ceiq"
                alt="logo ceiq"
                aria-label="logo ceiq"
                description="logo ceiq"
              >
                <LogoCeiq />
              </a>
            </Link>
            <div className="lg:w-4/6 flex sm:flex-wrap justify-between items-center md:px-6">
              <Search />
              <div className="invisible md:visible order-3 md:order-2">
                <ButtonDarkM
                  aria-describedby="boton-modo-oscuro"
                  alt="boton modo oscuro"
                  aria-label="boton modo oscuro"
                />
              </div>

              <div className="order-2 md:order-3">
                <Cart
                  cart={cart}
                  alt="carrito de compras"
                  aria-label="carrito de compras"
                  title="carrito de compras"
                  description="carrito de compras"
                />
              </div>

              <div className="order-last visible">
                {userInfo ? (
                  <>
                    <button
                      data-test="user-button"
                      className="hover:text-green mx-6"
                      type="button"
                      alt="boton usuario"
                      aria-label="boton usuario"
                      title="boton usuario"
                      description="boton usuario"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      onClick={loginClickHandler}
                    >
                      {userInfo.name}
                    </button>

                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={loginMenuCloseHandler}
                    >
                      <MenuItem
                        onClick={(e) => loginMenuCloseHandler(e, "/profile")}
                      >
                        Perfil
                      </MenuItem>
                      <MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler(e, "/order-history")
                        }
                      >
                        Historial de órdenes
                      </MenuItem>
                      {userInfo.isAdmin && (
                        <MenuItem
                          onClick={(e) =>
                            loginMenuCloseHandler(e, "/admin/dashboard")
                          }
                        >
                          Administración Dashboard
                        </MenuItem>
                      )}
                      <MenuItem
                        data-test="logout-button"
                        onClick={logoutClickHandler}
                      >
                        Cerrar Sesion
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Link href="/login" passHref>
                    <a
                      className="p-2"
                      alt="boton usuario"
                      aria-label="boton usuario"
                      title="boton usuario"
                      description="boton usuario"
                    >
                      <Userbtn
                        alt="boton usuario"
                        title="boton usuario"
                        description="boton usuario"
                        className="text-white h-6 w-6"
                      />
                    </a>
                  </Link>
                )}
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
    </>
  );
}
