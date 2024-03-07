import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { OrganizationInvitationSetPasswordForm } from "@/components/Auth/OrganizationInvitationSetPasswordForm";
import { supabaseClient } from "@/lib/supabase";
import { OrganizationInvitationAccountDetailForm } from "@/components/Auth/OrganizationInvitationAccountDetailForm";
import FullPageLoading from "@/components/FullPageLoading";
import { isEmpty } from "lodash";
import Image from "next/image";

const InvitePage = ({ loading, organizationId }) => {
  const router = useRouter();
  const { currentUser, isLoading: isLoadingCurrentUser } = useCurrentUser();

  const [step, setStep] = useState(1);

  const routeHash = router.asPath.split("#")[1];
  const splitHash = routeHash
    ?.split("&")
    .map((item) => [item.split("=")[0], item.split("=")[1]]);

  useEffect(() => {
    if (splitHash) {
      const isSession = splitHash.find((item) => item[0] === "access_token");
      const isError = splitHash.find((item) => item[0] === "error");

      if (isError || !isSession) return;

      const accessToken = splitHash.find(
        (item) => item[0] === "access_token"
      )[1];
      const refreshToken = splitHash.find(
        (item) => item[0] === "refresh_token"
      )[1];

      // Set session
      supabaseClient.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    }
  }, [splitHash]);

  const organization = useMemo(() => {
    if (!organizationId) return null;
    if (!currentUser) return null;

    return currentUser?.organizations?.find((org) => org.id == organizationId);
  }, [organizationId, currentUser]);

  const errorMessage = useMemo(() => {
    if (isEmpty(splitHash)) return "";

    const errorDescription = splitHash.find(
      (item) => item[0] === "error_description"
    );

    if (!errorDescription) return "";

    return errorDescription[1].split("+").join(" ");
  }, [splitHash]);

  const isLoading =
    isLoadingCurrentUser || isEmpty(currentUser) || isEmpty(organization);

  return (
    <div className="h-screen w-screen flex">
      {isLoading && <FullPageLoading />}
      {!isLoading && (
        <>
          <div className="w-1/2 flex justify-center items-center p-10">
            {currentUser && organization && (
              <div className="w-full bg-card max-w-sm shadow-lg rounded-xl p-5">
                {step === 1 && (
                  <OrganizationInvitationSetPasswordForm
                    organization={organization}
                    onSubmit={() => setStep(2)}
                  />
                )}
                {step === 2 && (
                  <OrganizationInvitationAccountDetailForm
                    organization={organization}
                    onContinue={() => router.push("/projects")}
                  />
                )}
              </div>
            )}

            {/* Invalid link */}
            <div>{errorMessage}</div>
          </div>
          <div className="w-1/2 bg-card relative border-l text-foreground flex justify-center items-center text-4xl px-4">
            {/* Replaced <h1> with Image component */}

            <Image src="/images/login-image.png" alt="Login Image" fill />
            <div className="absolute top-16 bottom-16 right-16 left-16 flex items-start justify-start">
              {/* <ThemeToggle /> */}
              <div className="flex space-y-6 flex-col w-4/5">
                <Image
                  src="/svgs/logo-white-text.svg"
                  alt="Logo"
                  width={107} // Adjust width as needed
                  height={49} // Adjust height as needed
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

export async function getServerSideProps(context) {
  const loading = context.query.loading === "true";
  return {
    props: { loading, organizationId: context.query.organization }, // will be passed to the page component as props
  };
}

export default InvitePage;
