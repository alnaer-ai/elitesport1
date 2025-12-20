import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "@/components/Layout";
import { PlaceModalProvider } from "@/components/places";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PlaceModalProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </PlaceModalProvider>
  );
}
