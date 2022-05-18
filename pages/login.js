import { List, ListItem, TextField } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';

function Login() {
  const router = useRouter();
  const { redirect } = router.query; // esto es para que redirija a login?redirect=/shipping
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/users/login', {
        email,
        password,
      });
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));
      router.push(redirect || '/');
      // alert('Inicio de sesión con exito!');
    } catch (err) {
      alert(err.response.data ? err.response.data.message : err.message);
    }
  };

  return (
    <Layout title="Ingresar">
      <div className="flex justify-center">
        <div className="card w-4/12 ">
          <form
            onSubmit={submitHandler}
            className="rounded px-8 pt-6 pb-8 mb-4"
          >
            <h1 className="text-4xl py-4">Ingresar</h1>
            <List>
              <ListItem>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="Email"
                  inputProps={{ type: 'email' }}
                  onChange={(e) => setEmail(e.target.value)}
                ></TextField>
              </ListItem>
              <ListItem>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="password"
                  label="Contraseña"
                  inputProps={{ type: 'password' }}
                  onChange={(e) => setPassword(e.target.value)}
                ></TextField>
              </ListItem>
              <ListItem>
                <button
                  className="bg-green py-2 px-8 shadow-md rounded-full hover:bg-cyan"
                  type="submit"
                >
                  Ingresar
                </button>
              </ListItem>
              <ListItem>
                <p className="mx-2">¿Aún no tienes una cuenta?</p>
                <Link href="/register" passHref>
                  <a className="text-green">Registrarse</a>
                </Link>
              </ListItem>
            </List>
          </form>
        </div>
      </div>
    </Layout>
  );
}

//esto es para evitar el error de Hydration

export default dynamic(() => Promise.resolve(Login), { ssr: false });
