import React, { useContext, useEffect, useState } from "react";
// import { useTheme } from 'next-themes';
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { Store } from "../utils/Store";
import { getError } from "../utils/error";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";

import dynamic from "next/dynamic";

import { useSnackbar } from "notistack";
import axios from "axios";
import ButtonCloseUi from "./buttons/ButtonCloseUi";
import CartBtn from "../components/buttons/CartBtn";
import Userbtn from "../components/buttons/Userbtn";
import HamburgerBtn from "./buttons/hamburgerBtn";
import LogoCeiq from "./LogoCeiq";
const ButtonDarkM = dynamic(() => import("../components/buttons/ButtonDarkM"), {
  ssr: false,
});

function Layout({ title, description, children }) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const [anchorEl, setAnchorEl] = useState(null);
  const [sidbarVisible, setSidebarVisible] = useState(false);

  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  const [categories, setCategories] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/products/categories`);
      setCategories(data);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  // codigo del buscador
  const [query, setQuery] = useState("");
  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  // codigo del buscador

  useEffect(() => {
    fetchCategories();
  }, []);

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
            <Box display="flex" alignItems="center">
              <IconButton
                alt="boton hamgurguesa"
                edge="start"
                type="button"
                aria-label="open drawer"
                onClick={sidebarOpenHandler}
              >
                <HamburgerBtn
                  alt="boton hamgurguesa"
                  className="text-white px-2 h-12 w-12"
                />

                <Link href="/" passHref>
                  <a
                    alt="logo-de-ceiq"
                    aria-describedby="logo-de-ceiq"
                    className="text-lg font-bold"
                  >
                    <LogoCeiq />
                  </a>
                </Link>
              </IconButton>
            </Box>

            {/* Esto define el menu oculto */}
            <Drawer
              anchor="left"
              open={sidbarVisible}
              onClose={sidebarCloseHandler}
            >
              <List>
                <ListItem>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <p className="text-xl text-gray-400 font-light">
                      Búsqueda por categoría
                    </p>
                    <IconButton
                      alt="boton cerrar"
                      aria-label="close"
                      onClick={sidebarCloseHandler}
                    >
                      <div className="text-green hover:bg-green hover:rounded-full hover:text-blue">
                        <ButtonCloseUi
                          alt="boton cerrar"
                          className="h-10 w-10 md:h-6 md:w-6"
                        />
                      </div>
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider light />
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/search?category=${category}`}
                    passHref
                  >
                    <div className="h-20">
                      <ListItem
                        button
                        component="a"
                        onClick={sidebarCloseHandler}
                      >
                        <ListItemText primary={category}></ListItemText>
                      </ListItem>
                    </div>
                  </Link>
                ))}
              </List>
              <Divider light />
              <div className="p-2 flex flex-col justify-around items-center">
                {userInfo ? (
                  <>
                    <button
                      className="hover:text-green mx-6"
                      type="button"
                      alt="boton usuario"
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
                      <MenuItem onClick={logoutClickHandler}>
                        Cerrar Sesion
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Link href="/login" passHref>
                    <a className="pt-4">
                      <Userbtn
                        alt="boton usuario"
                        className="h-10 w-10 text-cyan"
                      />
                    </a>
                  </Link>
                )}

                <div className="mt-12">
                  <ButtonDarkM
                    aria-describedby="boton-modo-oscuro"
                    alt="boton modo oscuro"
                  />
                </div>
              </div>
            </Drawer>

            {/* ********* BUSCARDOR - DARKMODE - CARRITO - LOGIN *********** */}

            <div className="lg:w-4/6 flex sm:flex-wrap justify-between items-center md:px-6">
              <div className="md:w-3/6 lg:w-4/6 order-1">
                <form
                  onSubmit={submitHandler}
                  className="flex items-center justify-between"
                >
                  <InputBase
                    className="bg-white rounded-l-lg p-4 h-6 m-0 text-gray-300 hover:text-cyan w-full"
                    name="query"
                    placeholder="Buscar productos"
                    onChange={queryChangeHandler}
                  />
                  <button
                    className="bg-cyan px-2 py-2 rounded-r-lg"
                    type="submit"
                    alt="boton buscador"
                    aria-describedby="boton-buscador"
                    aria-label="search"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-5 text-white "
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </form>
              </div>

              {/* ********* darkmode carrito usuario ********* */}

              <div className="invisible md:visible order-3 md:order-2">
                <ButtonDarkM
                  aria-describedby="boton-modo-oscuro"
                  alt="boton modo oscuro"
                />
              </div>

              <div className="order-2 md:order-3">
                <Link href="/cart" passHref>
                  <a className="p-2 md:visible">
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
              </div>

              <div className="order-last invisible md:visible">
                {userInfo ? (
                  <>
                    <button
                      data-test="user-button"
                      className="hover:text-green mx-6"
                      type="button"
                      alt="boton usuario"
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
                    <a className="p-2 invisible md:visible">
                      <Userbtn
                        alt="boton usuario"
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

// esto es para evitar el error de Hydration
export default dynamic(() => Promise.resolve(Layout), { ssr: false });
