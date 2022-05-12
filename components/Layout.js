import Head from 'next/head';
import Link from 'next/link';
import React, { useContext } from 'react';
import Image from 'next/image';
import { Store } from '../utils/Store';
import { createTheme, CssBaseline, Switch } from '@mui/material';
import { ThemeProvider } from '@mui/styles';
import jsCookies from 'js-cookie';

export default function Layout({ title, description, children }) {
  const { state, dispatch } = useContext(Store);
  const { darkMode } = state;

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        // main: '#FDCA58',
        main: '#f48fb1',
      },
      secondary: {
        main: '#03C2F3',
      },
    },
  });

  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    jsCookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };

  return (
    <>
      <Head>
        <title>{title ? title + ' - CEIQ Shop' : 'CEIQ Shop'}</title>
        {description && <meta name="description" content={description} />}

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />
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
                <Switch
                  checked={darkMode}
                  onChange={darkModeChangeHandler}
                ></Switch>
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
      </ThemeProvider>
    </>
  );
}
