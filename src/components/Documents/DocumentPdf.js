import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useToast } from "../ui/use-toast";

import { cn } from "@/lib/utils";

import LucideIcon from "../LucideIcon";
import { DocumentLoader } from "./Document";
import { memo, useEffect, useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const DocumentPdf = ({ url, width, scale, setIsLoadingPdf }) => {
  const [file, setFile] = useState();
  const [isLoading, setFileLoading] = useState();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        setFileLoading(true);
        const response = await fetch(url);
        const blob = await response.blob();
        setFile(URL.createObjectURL(blob));
        setFileLoading(false);
      } catch (error) {
        setFileLoading(false);
        toast({
          title: "Error loading PDF",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    };
    if (url && !file && !isLoading) {
      fetchPDF();
    }
  }, [url, toast, isLoading]);
  return (
    <div className="relative">
      {file && !isLoading ? (
        <Document
          noData={
            <div className="h-screen w-screen flex items-center justify-center">
              No Document
            </div>
          }
          loading={<DocumentLoader />}
          onLoadError={() => {
            toast({
              title: "Error loading PDF",
              description: "Please try again later",
              variant: "destructive",
            });
          }}
          width={width ? width : 1}
          file={file}
          className="relative min-h-full max-h-full w-auto"
        >
          <Page
            className={cn("mx-8 w-auto bg-transparent")}
            style={{ backgroundColor: "transparent" }}
            width={width ? width : 1}
            pageNumber={1}
            scale={scale}
            key={"@" + scale}
            onRenderSuccess={() => {
              setIsLoadingPdf(false);
            }}
            loading={
              <div className="flex justify-center h-screen items-center w-auto">
                <LucideIcon
                  name="loader-2"
                  className="my-24 h-6 w-6 animate-spin"
                />
              </div>
            }
          />
        </Document>
      ) : (
        <div className="flex justify-center h-screen items-center w-auto">
          <DocumentLoader />
        </div>
      )}
    </div>
  );
};

const MemoizedDocumentPdf = memo(DocumentPdf);

export default MemoizedDocumentPdf;
