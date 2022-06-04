import React, { useContext, useEffect, useState } from "react";
// import { useTheme } from 'next-themes';
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
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
import Button from "./Button";
import { useSnackbar } from "notistack";
import axios from "axios";
const ButtonDarkM = dynamic(() => import("./ButtonDarkM"), { ssr: false });

export default function Layout({ title, description, children }) {
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
    router.push("/");
  };

  return (
    <>
      <Head>
        <title>{title ? title + " - CEIQ Shop" : "CEIQ Shop"}</title>
        {description && <meta name="description" content={description} />}

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="dark:flex min-h-screen flex-col justify-between ">
        <header>
          <nav className="flex h-12 items-center px-4 justify-between shadow-md navbar">
            <Box display="flex" alignItems="center">
              <IconButton
                edge="start"
                aria-label="open drawer"
                onClick={sidebarOpenHandler}
              >
                <Button className="text-white px-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
                <Link href="/" passHref>
                  <a className="text-lg font-bold">
                    <Image
                      src="/logo_ceiqShop.svg"
                      width={280}
                      height={64}
                      alt="logo"
                    />
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
                      aria-label="close"
                      onClick={sidebarCloseHandler}
                    >
                      <Button className="text-green hover:bg-green hover:text-blue">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Button>
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
                    <ListItem
                      button
                      component="a"
                      onClick={sidebarCloseHandler}
                    >
                      <ListItemText primary={category}></ListItemText>
                    </ListItem>
                  </Link>
                ))}
              </List>
            </Drawer>

            {/* ********* buscador *********** */}

            <div className="w-4/12">
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
                <IconButton type="submit" aria-label="search">
                  <Button className="bg-cyan rounded-r-lg">
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
                  </Button>
                </IconButton>
              </form>
            </div>

            {/* ********* buscador *********** */}

            {/* ********* darkmode carrito usuario ********* */}

            <div className="w-64  flex justify-between">
              <ButtonDarkM />

              <Link href="/cart" passHref>
                <a className="p-2 ">
                  Carrito
                  {cart.cartItems.length > 0 && (
                    <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </span>
                  )}
                </a>
              </Link>

              {userInfo ? (
                <>
                  <button
                    className="hover:text-green mx-6"
                    type="button"
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
                  <a className="p-2">Ingresar</a>
                </Link>
              )}
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
