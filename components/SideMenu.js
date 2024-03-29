import React, { useState, useEffect, useCallback } from "react";
// import dynamic from 'next/dynamic';
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
import ButtonCloseUi from "./buttons/ButtonCloseUi";
import HamburgerBtn from "./buttons/HamburgerBtn";
import ButtonDarkM from "./buttons/ButtonDarkM";

export const config = {
  unstable_runtimeJS: false,
};

function SideMenu() {
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

  const sidebarOpenHandler = useCallback(() => {
    setSidebarVisible(true);
  }, [setSidebarVisible]);

  const sidebarCloseHandler = useCallback(() => {
    setSidebarVisible(false);
  }, [setSidebarVisible]);

  return (
    <>
      <Box display="flex" alignItems="center">
        <IconButton
          alt="boton hamgurguesa"
          title="boton hamgurguesa"
          description="boton hamgurguesa"
          edge="start"
          type="button"
          aria-label="open drawer"
          onClick={sidebarOpenHandler}
        >
          <HamburgerBtn
            alt="boton hamgurguesa"
            title="boton hamgurguesa"
            description="boton hamgurguesa"
            className="text-white px-2 h-12 w-12"
          />
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
          <ButtonDarkM
            aria-describedby="boton-modo-oscuro"
            alt="boton modo oscuro"
            title="boton modo oscuro"
            description="boton modo oscuro"
          />
        </div>
      </Drawer>
    </>
  );
}

function areEqual(prevProps, nextProps) {
  return prevProps.product === nextProps.product;
}
export default React.memo(SideMenu, areEqual);
