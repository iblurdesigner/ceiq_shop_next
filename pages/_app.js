import '../styles/globals.css';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { StoreProvider } from '../utils/Store';
import { ThemeProvider } from 'next-themes';

const clientSideEmotionCache = createCache({ key: 'css' });

function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}) {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider defaultTheme="light">
        <StoreProvider>
          <Component {...pageProps} />;
        </StoreProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
