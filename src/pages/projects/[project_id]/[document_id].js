import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import DocumentLayout from "@/components/DocumentLayout";
import Document, { DocumentLoader } from "@/components/Documents/Document";
import Room from "@/components/Room";
import { useDocument } from "@/lib/hooks/useDocument";
import DocumentToolbar from "@/components/Documents/DocumentToolBar";
import DocumentsButtonList from "@/components/Documents/DocumentsButtonList";
import DocumentSideBar from "@/components/Documents/DocumentSideBar";
import BackgroundGrid from "@/components/BackgroundGrid";

export default function DocumentPage() {
  const { document, isLoading: isDocumentLoading } = useDocument();
  return (
    <>
      <DocumentLayout sidebar={<DocumentSideBar />} className="bg-card">
        <BackgroundGrid />
        {isDocumentLoading || !document ? (
          <div className="absolute top-0 left-0 right-0 bottom-0">
            <DocumentLoader />
          </div>
        ) : (
          <Room roomId={document?.id || "fallback"}>
            {() => {
              return (
                <Document storageBucketKey={document?.storage_bucket_key} />
              );
            }}
          </Room>
        )}
        <DocumentToolbar />
        <DocumentsButtonList />
      </DocumentLayout>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createPagesServerClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  // we should get the document and correct document version somehow
  return {
    props: {},
  };
};
