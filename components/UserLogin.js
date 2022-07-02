import React, { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Menu, MenuItem } from "@mui/material";
import Link from "next/link";
import Userbtn from "../components/buttons/Userbtn";

export default function UserLogin({ className, dispatch, userInfo }) {
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
            <MenuItem onClick={(e) => loginMenuCloseHandler(e, "/profile")}>
              Perfil
            </MenuItem>
            <MenuItem
              onClick={(e) => loginMenuCloseHandler(e, "/order-history")}
            >
              Historial de órdenes
            </MenuItem>
            {userInfo.isAdmin && (
              <MenuItem
                onClick={(e) => loginMenuCloseHandler(e, "/admin/dashboard")}
              >
                Administración Dashboard
              </MenuItem>
            )}
            <MenuItem data-test="logout-button" onClick={logoutClickHandler}>
              Cerrar Sesion
            </MenuItem>
          </Menu>
        </>
      ) : (
        <Link href="/login" passHref>
          <a className="p-2">
            <Userbtn alt="boton usuario" className={`${className} h-6 w-6`} />
          </a>
        </Link>
      )}
    </>
  );
}
