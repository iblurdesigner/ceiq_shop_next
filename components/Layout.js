import React, { useContext, useState } from 'react';
// import { useTheme } from 'next-themes';
// import Button from './Button';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { Store } from '../utils/Store';
import { Menu, MenuItem } from '@mui/material';

import dynamic from 'next/dynamic';
const ButtonDarkM = dynamic(() => import('./ButtonDarkM'), { ssr: false });

export default function Layout({ title, description, children }) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const [anchorEl, setAnchorEl] = useState(null);

  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const loginMenuCloseHandler = () => {
    setAnchorEl(null);
  };
  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: 'USER_LOGOUT' });
    Cookies.remove('userInfo');
    Cookies.remove('cartItems');
    router.push('/');
  };

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
                    <MenuItem onClick={loginMenuCloseHandler}>Perfil</MenuItem>
                    <MenuItem onClick={loginMenuCloseHandler}>
                      Mi cuenta
                    </MenuItem>
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
