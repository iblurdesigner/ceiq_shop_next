import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getError } from "../utils/error";
import { useSnackbar } from "notistack";
import axios from "axios";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
const ButtonCloseUi = dynamic(() => import("./buttons/ButtonCloseUi"), {
  suspense: true,
  ssr: false,
});
const HamburgerBtn = dynamic(() => import("./buttons/HamburgerBtn"), {
  suspense: true,
  ssr: false,
});
const LogoCeiq = dynamic(() => import("./LogoCeiq"), {
  suspense: true,
  ssr: false,
});
const ButtonDarkM = dynamic(() => import("../components/buttons/ButtonDarkM"), {
  suspense: true,
  ssr: false,
});

export const config = {
  unstable_runtimeJS: false,
};

export default function SideMenu() {
  const [sidbarVisible, setSidebarVisible] = useState(false);

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  return (
    <>
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
      <Drawer anchor="left" open={sidbarVisible} onClose={sidebarCloseHandler}>
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
            <Link key={category} href={`/search?category=${category}`} passHref>
              <div className="h-20">
                <ListItem button component="a" onClick={sidebarCloseHandler}>
                  <ListItemText primary={category}></ListItemText>
                </ListItem>
              </div>
            </Link>
          ))}
        </List>
        <Divider light />
        <div className="p-2 flex flex-col justify-around items-center">
          {/* <UserLogin className="text-blue" props={(dispatch, userInfo)} />
          <div className="mt-12">
          </div> */}
          <ButtonDarkM
            aria-describedby="boton-modo-oscuro"
            alt="boton modo oscuro"
          />
        </div>
      </Drawer>
    </>
  );
}
