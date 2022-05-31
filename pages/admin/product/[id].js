import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { useEffect, useContext, useReducer } from 'react';
import {
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material';
import { getError } from '../../../utils/error';
import { Store } from '../../../utils/Store';
import Layout from '../../../components/Layout';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      state;
  }
}

function ProductEdit({ params }) {
  const productId = params.id;
  const { state } = useContext(Store);

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });
          const { data } = await axios.get(`/api/admin/products/${productId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          dispatch({ type: 'FETCH_SUCCESS' });
          setValue('name', data.name);
          setValue('slug', data.slug);
          setValue('price', data.price);
          setValue('image', data.image);
          setValue('category', data.category);
          setValue('brand', data.brand);
          setValue('rating', data.rating);
          setValue('numReviews', data.numReviews);
          setValue('countInStock', data.countInStock);
          setValue('description', data.description);
        } catch (err) {
          dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        }
      };
      fetchData();
    }
  }, []);

  const uploadHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/admin/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipar  t/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      setValue('image', data.secure_url);
      enqueueSnackbar('El archivo se ha subido, actualice por favor', {
        variant: 'success',
      });
    } catch (err) {
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  const submitHandler = async ({
    name,
    slug,
    price,
    category,
    image,
    brand,
    rating,
    numReviews,
    countInStock,
    description,
  }) => {
    closeSnackbar();

    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/admin/products/${productId}`,
        {
          name,
          slug,
          price,
          category,
          image,
          brand,
          rating,
          numReviews,
          countInStock,
          description,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      enqueueSnackbar('El Producto se ha actualizado con exito!', {
        variant: 'success',
      });
      router.push('/admin/products');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), {
        variant: 'error',
      });
    }
  };

  return (
    <>
      <Layout title={`Editar Producto ${productId}`}>
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
                  <h1 className="text-4xl py-4">
                    Editar Producto ${productId}
                  </h1>
                </li>
                <li>
                  {loading && <CircularProgress></CircularProgress>}
                  {error && <p>{error}</p>}
                </li>
                <li>
                  <div className="flex justify-center">
                    <div className="card w-8/12 ">
                      <form
                        onSubmit={handleSubmit(submitHandler)}
                        className="rounded px-8 pt-6 pb-8 mb-4"
                      >
                        <List>
                          <ListItem>
                            <Controller
                              name="name"
                              control={control}
                              defaultValue=""
                              rules={{
                                required: true,
                              }}
                              render={({ field }) => (
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  id="name"
                                  label="Nombre"
                                  error={Boolean(errors.name)}
                                  helperText={
                                    errors.name ? 'El nombre es requerido' : ''
                                  }
                                  {...field}
                                ></TextField>
                              )}
                            ></Controller>
                          </ListItem>
                          <ListItem>
                            <Controller
                              name="slug"
                              control={control}
                              defaultValue=""
                              rules={{
                                required: true,
                              }}
                              render={({ field }) => (
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  id="slug"
                                  label="Slug"
                                  error={Boolean(errors.slug)}
                                  helperText={
                                    errors.slug ? 'Slug es requerido' : ''
                                  }
                                  {...field}
                                ></TextField>
                              )}
                            ></Controller>
                          </ListItem>
                          <ListItem>
                            <Controller
                              name="price"
                              control={control}
                              defaultValue=""
                              rules={{
                                required: true,
                              }}
                              render={({ field }) => (
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  id="price"
                                  label="Precio"
                                  error={Boolean(errors.price)}
                                  helperText={
                                    errors.price ? 'El precio es requerido' : ''
                                  }
                                  {...field}
                                ></TextField>
                              )}
                            ></Controller>
                          </ListItem>
                          <ListItem>
                            <Controller
                              name="image"
                              control={control}
                              defaultValue=""
                              rules={{
                                required: true,
                              }}
                              render={({ field }) => (
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  id="image"
                                  label="Imagen"
                                  error={Boolean(errors.image)}
                                  helperText={
                                    errors.image ? 'La imagen es requerido' : ''
                                  }
                                  {...field}
                                ></TextField>
                              )}
                            ></Controller>
                          </ListItem>

                          <ListItem>
                            <Button variant="contained" component="label">
                              Subir imagen
                              <input
                                type="file"
                                onChange={uploadHandler}
                                hidden
                              />
                            </Button>
                            {loadingUpload && <CircularProgress />}
                          </ListItem>

                          <ListItem>
                            <Controller
                              name="category"
                              control={control}
                              defaultValue=""
                              rules={{
                                required: true,
                              }}
                              render={({ field }) => (
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  id="category"
                                  label="Categoría"
                                  error={Boolean(errors.category)}
                                  helperText={
                                    errors.category
                                      ? 'La Categoría es requerido'
                                      : ''
                                  }
                                  {...field}
                                ></TextField>
                              )}
                            ></Controller>
                          </ListItem>
                          <ListItem>
                            <Controller
                              name="brand"
                              control={control}
                              defaultValue=""
                              rules={{
                                required: true,
                              }}
                              render={({ field }) => (
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  id="brand"
                                  label="Marca"
                                  error={Boolean(errors.brand)}
                                  helperText={
                                    errors.brand ? 'La marca es requerido' : ''
                                  }
                                  {...field}
                                ></TextField>
                              )}
                            ></Controller>
                          </ListItem>
                          <ListItem>
                            <Controller
                              name="rating"
                              control={control}
                              defaultValue=""
                              rules={{
                                required: true,
                              }}
                              render={({ field }) => (
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  id="rating"
                                  label="rating"
                                  error={Boolean(errors.rating)}
                                  helperText={
                                    errors.rating
                                      ? 'El rating es requerido'
                                      : ''
                                  }
                                  {...field}
                                ></TextField>
                              )}
                            ></Controller>
                          </ListItem>
                          <ListItem>
                            <Controller
                              name="numReviews"
                              control={control}
                              defaultValue=""
                              rules={{
                                required: true,
                              }}
                              render={({ field }) => (
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  id="numReviews"
                                  label="Número de revisiones"
                                  error={Boolean(errors.numReviews)}
                                  helperText={
                                    errors.numReviews
                                      ? 'Las revisiones son requeridas'
                                      : ''
                                  }
                                  {...field}
                                ></TextField>
                              )}
                            ></Controller>
                          </ListItem>
                          <ListItem>
                            <Controller
                              name="countInStock"
                              control={control}
                              defaultValue=""
                              rules={{
                                required: true,
                              }}
                              render={({ field }) => (
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  id="countInStock"
                                  label="Cantidad"
                                  error={Boolean(errors.countInStock)}
                                  helperText={
                                    errors.countInStock
                                      ? 'La cantidad es requerida'
                                      : ''
                                  }
                                  {...field}
                                ></TextField>
                              )}
                            ></Controller>
                          </ListItem>
                          <ListItem>
                            <Controller
                              name="description"
                              control={control}
                              defaultValue=""
                              rules={{
                                required: true,
                              }}
                              render={({ field }) => (
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  multiline
                                  id="description"
                                  label="Descripción"
                                  error={Boolean(errors.description)}
                                  helperText={
                                    errors.description
                                      ? 'La descripción es requerida'
                                      : ''
                                  }
                                  {...field}
                                ></TextField>
                              )}
                            ></Controller>
                          </ListItem>

                          <ListItem>
                            <button
                              className="bg-green py-2 px-8 shadow-md rounded-full hover:bg-cyan"
                              type="submit"
                            >
                              Actualizar
                            </button>
                            {loadingUpdate && <CircularProgress />}
                          </ListItem>
                        </List>
                      </form>
                    </div>
                  </div>
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

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false });
