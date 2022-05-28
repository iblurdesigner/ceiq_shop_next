import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { useEffect, useContext, useReducer } from 'react';
import { CircularProgress, List, ListItem, ListItemText } from '@mui/material';

import { getError } from '../../utils/error';
import { Store } from '../../utils/Store';
import Layout from '../../components/Layout';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function ProductsDashboard() {
  const { state } = useContext(Store);
  const router = useRouter();

  const { userInfo } = state;

  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
  });

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/products`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <Layout title="Órdenes">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 min-h-screen">
          <div>
            <div className="card p-6">
              <List>
                <Link href="/admin/dashboard" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="Administración Dashboard"></ListItemText>
                  </ListItem>
                </Link>
                <Link href="/admin/orders" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="Órdenes"></ListItemText>
                  </ListItem>
                </Link>
                <Link href="/admin/products" passHref>
                  <ListItem selected button component="a">
                    <ListItemText primary="Productos"></ListItemText>
                  </ListItem>
                </Link>
              </List>
            </div>
          </div>

          <div className="col-span-3">
            <div className="card p-6">
              <ul>
                <li>
                  <h1 className="text-4xl py-4">Órdenes</h1>
                </li>

                <li>
                  {loading ? (
                    <CircularProgress />
                  ) : error ? (
                    <p>{error}</p>
                  ) : (
                    <>
                      <table className="table-fixed tableInfo">
                        <thead>
                          <tr>
                            <th className="py-2">ID</th>
                            <th className="py-2">NOMBRE</th>
                            <th className="py-2">PRECIO</th>
                            <th className="py-2">CATEGORIA</th>
                            <th className="py-2">CANTIDAD</th>
                            <th className="py-2">RATING</th>
                            <th className="py-2">ACCIONES</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product) => (
                            <tr
                              key={product._id}
                              className="divide-y divide-sky-300"
                            >
                              <td className="py-6">
                                {product._id.substring(20, 24)}
                              </td>
                              <td>{product.name}</td>
                              <td>${product.price}</td>
                              <td>{product.category}</td>
                              <td>{product.countInStock}</td>
                              <td>{product.rating}</td>
                              <td>
                                <Link
                                  href={`/admin/product/${product._id}`}
                                  passHref
                                >
                                  <button className="bg-green rounded-full px-3 py-1 shadow-xl hover:bg-yellow">
                                    Editar
                                  </button>
                                </Link>{' '}
                                <Link
                                  href={`/admin/product/${product._id}`}
                                  passHref
                                >
                                  <button className="bg-green rounded-full px-3 py-1 shadow-xl hover:bg-yellow">
                                    Eliminar
                                  </button>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Layout>

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
  );
}

export default dynamic(() => Promise.resolve(ProductsDashboard), {
  ssr: false,
});
