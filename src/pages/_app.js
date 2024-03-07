import "@/styles/globals.css";
import "@liveblocks/react-comments/styles.css";
// Dark mode using `className="dark"`, `data-theme="dark"`, or `data-dark="true"`
import "@liveblocks/react-comments/styles/dark/attributes.css";
import Head from "next/head";
import { ThemeProvider } from "@/components/ThemeProvider";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { RecoilRoot } from "recoil";

export default function App({ Component, pageProps }) {
  const title = "Arcade | Make your files smarter";
  const description =
    "Transform your files & documents into user-friendly smart PDFs for seamless page-to-page and external linking";
  // const imageUrl = "https://res.cloudinary.com/ltvw42nmh/image/upload/v1700926458/main-share-image-compressed_nl96ps.jpg";
  // const imageUrl =
  //   "https://res.cloudinary.com/ltvw42nmh/image/upload/v1704413673/share_dpkcxe.png";
  const imageUrl =
    "https://res.cloudinary.com/ltvw42nmh/image/upload/v1707460406/share_elgbas.png";
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <meta name="msapplication-TileColor" content="#272727" />
        <meta name="theme-color" content="#272727" />
        <meta name="color-scheme" content="light dark" />
      </Head>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={pageProps.initialSession}
        >
          <RecoilRoot>
            <Component {...pageProps} />
            <Toaster />
          </RecoilRoot>
        </SessionContextProvider>
      </ThemeProvider>
    </>
  );
}
