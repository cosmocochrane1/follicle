import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import FullPageLoading from "@/components/FullPageLoading";
import Image from "next/image";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useTheme } from "next-themes";

const AuthPage = ({ loading }) => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const timeoutRef = useRef();
  const { theme } = useTheme();

  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          router.replace("/projects");
        }
        if (session) {
          router.replace("/projects");
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router, supabaseClient]);

  useEffect(() => {
    if (loading) {
      timeoutRef.current = setTimeout(() => {
        router.replace("/auth");
      }, 10000);
    }
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [loading]);

  return (
    <div className="h-screen w-screen flex">
      {/* <div className='fixed top-6 left-6'>
        <ThemeToggle />
      </div> */}
      {loading && <FullPageLoading />}
      {!loading && (
        <>
          <div className="w-1/2 flex justify-center items-center p-10">
            <div className="w-full bg-card max-w-sm shadow-lg rounded-xl p-5">
              <Auth
                redirectTo={process.env.NEXT_PUBLIC_SUPABASE_AUTH_REDIRECT_URL}
                appearance={{
                  theme: ThemeSupa,
                }}
                theme={theme}
                supabaseClient={supabaseClient}
                providers={["google"]}
                socialLayout="horizontal"
              />
            </div>
          </div>
          <div className="w-1/2 bg-card relative border-l text-foreground flex justify-center items-center text-4xl px-4">
            {/* Replaced <h1> with Image component */}

            <Image src="/images/login-image.png" alt="Login Image" fill />
            <div className="absolute top-16 bottom-16 right-16 left-16 flex items-start justify-start">
              {/* <ThemeToggle /> */}
              <div className="flex space-y-6 flex-col w-4/5">
                <Image
                  src="/svgs/logo-white.svg"
                  className="invert dark:invert-0"
                  alt="Logo"
                  width={100} // Adjust width as needed
                  height={45} // Adjust height as needed
                  layout="fixed"
                />

                {/* <h1 className='text-4xl font-semibold leading-snug'>Sync, Share,<br/>And Smartify.</h1> */}
                <h1 className="text-4xl font-light leading-tight">
                  Make your documents
                  <br />
                  <span className="font-medium">Smarter.</span>
                </h1>
                <p className="text-lg leading-relaxed">
                  Transform your files & documents into user-friendly smart PDFs
                  for seamless page-to-page and external linking
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  const supabase = createPagesServerClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session)
    return {
      redirect: {
        destination: "/projects",
        permanent: false,
      },
    };

  const loading = ctx.query.loading === "true";
  return {
    props: { loading }, // will be passed to the page component as props
  };
};

export default AuthPage;
