import { List, ListItem, TextField } from '@mui/material';
import Link from 'next/link';
import NextLink from 'next/link';
import React from 'react';
import Layout from '../components/Layout';

export default function Login() {
  return (
    <Layout title="Ingresar">
      <div className="flex min-h-screen justify-center">
        <div className="card w-5/12 p-6">
          <form>
            <h1 className="text-4xl py-4">Ingresar</h1>
            <List>
              <ListItem>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="Email"
                  inputProps={{ type: 'email' }}
                ></TextField>
              </ListItem>
              <ListItem>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="password"
                  label="Contraseña"
                  inputProps={{ type: 'password' }}
                ></TextField>
              </ListItem>
              <ListItem>
                <button
                  className="bg-green py-2 px-8 shadow-md rounded-full hover:bg-cyan"
                  type="button"
                >
                  Ingresar
                </button>
              </ListItem>
              <ListItem>
                <p className="mx-2">¿Aún no tienes una cuenta?</p>
                <NextLink href="/register" passHref>
                  <Link>
                    <a className="text-green">Registrarse</a>
                  </Link>
                </NextLink>
              </ListItem>
            </List>
          </form>
        </div>
      </div>
    </Layout>
  );
}
