import "../styles/globals.css";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { StoreProvider } from "../utils/Store";
import { ThemeProvider } from "next-themes";
import { SnackbarProvider } from "notistack";
import dynamic from "next/dynamic";

const clientSideEmotionCache = createCache({ key: "css" });
export function reportWebVitals(metric) {
  switch (metric.name) {
    case "FCP":
      // handle FCP results
      console.log(metric);
      break;
    case "LCP":
      // handle LCP results
      console.log(metric);
      break;
    case "CLS":
      // handle CLS results
      console.log(metric);
      break;
    case "FID":
      // handle FID results
      console.log(metric);
      break;
    case "TTFB":
      // handle TTFB results
      console.log(metric);
      break;
    default:
      break;
  }
}
function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}) {
  return (
    <CacheProvider value={emotionCache}>
      <SnackbarProvider
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <ThemeProvider attribute="class">
          <StoreProvider>
            <PayPalScriptProvider deferLoading={true}>
              <Component {...pageProps} />;
            </PayPalScriptProvider>
          </StoreProvider>
        </ThemeProvider>
      </SnackbarProvider>
    </CacheProvider>
  );
}

// esto es para evitar el error de Hydration
export default dynamic(() => Promise.resolve(MyApp), { ssr: false });
