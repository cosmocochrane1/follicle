import { baseUrl } from "../utils";
import { Body, Head, Html, Tailwind } from "jsx-email";

const Wrapper = ({ children, title }) => {
  return (
    <Html lang="en">
      <Head>
        <title>{title || "Ijin"}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link rel="stylesheet" href={baseUrl("/email/email.css")} />
      </Head>

      <Tailwind
        config={{
          theme: {
            extend: {
              fontFamily: {
                sans: ["Inter", "sans-serif"],
              },
              colors: {
                background: "#fff",
                foreground: "#000",

                // TODO : fix colors

                // muted: "#f6f6f6",
                // "muted-foreground": "#737373",
                // popover: "#ffffff",
                // "popover-foreground": "#000000",
                // card: "#ffffff",
                // "card-foreground": "#000000",
                // border: "#e5e5e5",
                // input: "#e5e5e5",
                primary: "#1B6BF5",
                "primary-foreground": "#fafafa",
                // secondary: "#f6f6f6",
                // "secondary-foreground": "#161616",
                // accent: "#f6f6f6",
                // "accent-foreground": "#161616",
                // destructive: "#d6ad99",
                // "destructive-foreground": "#fafafa",
                // ring: "#a3a3a3",
                radius: "0.5rem",
              },
              borderRadius: {
                lg: "0.5rem",
                md: "calc(0.5rem - 2px)",
                sm: "calc(0.5rem - 4px)",
              },
            },
          },
        }}
        production
      >
        <Body className="bg-background w-full">{children}</Body>
      </Tailwind>
    </Html>
  );
};

export default Wrapper;
