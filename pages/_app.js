import '../styles/globals.css';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { StoreProvider } from '../utils/Store';
import { ThemeProvider } from 'next-themes';
import { SnackbarProvider } from 'notistack';

const clientSideEmotionCache = createCache({ key: 'css' });

function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}) {
  return (
    <CacheProvider value={emotionCache}>
      <SnackbarProvider
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <ThemeProvider defaultTheme="light">
          <StoreProvider>
            <Component {...pageProps} />;
          </StoreProvider>
        </ThemeProvider>
      </SnackbarProvider>
    </CacheProvider>
  );
}

export default MyApp;
