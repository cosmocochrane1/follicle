import { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";

// this is a very expensive opperation, as we hit a bunch of endpoints n number of times depending on the number of documents
export const useMergePdfFromBucket = (documents) => {
  const [mergedPdf, setMergedPdf] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const mergePdfs = async () => {
      if (!documents || documents.length === 0) return;

      setIsLoading(true);
      setError(null);

      try {
        const mergedPdfDoc = await PDFDocument.create();

        const fetchAndLoadPDFs = documents.map(async (document) => {
          const bucketUrl = `/api/buckets/documents?path=${document.storage_bucket_key}`;
          const response = await fetch(bucketUrl);
          if (!response.ok) throw new Error("Error fetching document URL");
          const url = await response.json();
          const pdfResponse = await fetch(url);
          const arrayBuffer = await pdfResponse.arrayBuffer();
          return PDFDocument.load(arrayBuffer);
        });

        // Use Promise.all to fetch and load all PDFs in parallel
        const pdfDocs = await Promise.all(fetchAndLoadPDFs);

        // Merge all pages from each document
        for (const pdfDoc of pdfDocs) {
          const copiedPages = await mergedPdfDoc.copyPages(
            pdfDoc,
            pdfDoc.getPageIndices()
          );
          copiedPages.forEach((page) => mergedPdfDoc.addPage(page));
        }

        // Save the merged PDF as a Uint8Array
        const mergedPdfBytes = await mergedPdfDoc.save();
        setMergedPdf(mergedPdfBytes);
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    mergePdfs();
  }, [documents]);

  return { mergedPdf, isLoading, error };
};
