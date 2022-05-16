import React, { useContext } from 'react';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import Link from 'next/link';
import Image from 'next/image';
import { Select, MenuItem } from '@mui/material';
import dynamic from 'next/dynamic';

// Ojo: para evitar el error de la Hydration hay que usar dynamic de next, eliminando la exportacion por defecto de la funcion CartScreen

function CartScreen() {
  const { state } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  return (
    <Layout title="Carrito de compras">
      <h1 className="text-4xl py-4">Carrito de compras</h1>

      {cartItems.length === 0 ? (
        <div>
          El carrito se encuentra vacío
          <Link href="/" passHref>
            <a>Ir a comprar</a>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 min-h-screen">
            <div className="col-span-3">
              <table className="table-fixed tableInfo">
                <thead>
                  <tr>
                    <th className="py-2">Imagen</th>
                    <th className="py-2">Nombre</th>
                    <th className="py-2">Cantidad</th>
                    <th className="py-2">Precio</th>
                    <th className="py-2">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id}>
                      <td className="py-2">
                        <Link href={`/product/${item.slug}`} passHref>
                          <a>
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            ></Image>
                          </a>
                        </Link>
                      </td>
                      <td>
                        <Link href={`/product/${item.slug}`} passHref>
                          <a>
                            <p>{item.name}</p>
                          </a>
                        </Link>
                      </td>
                      <td>
                        <Select value={item.quantity}>
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <MenuItem key={x + 1} value={x + 1}>
                              {x + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </td>
                      <td>${item.price}</td>
                      <td>
                        <button className="primary-button" type="button">
                          x
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* card */}
            <div className="card h-min">
              <div className="flex flex-col justify-around p-5 gap-y-4">
                <h2 variant="h2">
                  <span className="text-lg font-bold">Subtotal </span>(
                  {cartItems.reduce((a, c) => a + c.quantity, 0)} items) : $
                  {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                </h2>
                <button className="primary-button rounded-full px-3 py-1">
                  Pagar
                </button>
              </div>
            </div>
          </div>

          {/* clases con JSX */}
          <style jsx>
            {`
              .tableInfo {
                width: -webkit-fill-available;
              }

              th {
                text-align: initial;
              }
            `}
          </style>
        </>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
