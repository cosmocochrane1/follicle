import LucideIcon from "../LucideIcon";
import { useBucket } from "@/lib/hooks/useBucket";
import ThreadsComposer from "../Threads/ThreadsComposer";
import Threads from "../Threads";
import Cursors from "../Cursors";
import { memo, useCallback, useMemo, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import DocumentCanvas from "./DocumentCanvas";

export const DocumentLoader = () => {
  return (
    <div className="flex justify-center h-full w-full min-w-full min-h-full items-center">
      <LucideIcon
        name="loader-2"
        className="h-8 w-8 animate-spin stroke-primary"
      />
    </div>
  );
};

const Document = ({ storageBucketKey }) => {
  const { width, ref } = useResizeDetector();
  const { data: url, isLoading: isBucketLoading } = useBucket(
    "documents",
    storageBucketKey ?? ""
  );
  const [isLoadingPdf, setIsLoadingPdf] = useState(true);
  const showDocumentLoader = useMemo(() => {
    return isBucketLoading || !url;
  }, [isBucketLoading, url]);
  const showDocumentOverlays = useMemo(() => {
    return !isBucketLoading && !isLoadingPdf && url;
  }, [isBucketLoading, url, isLoadingPdf]);
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0">
      {showDocumentLoader ? (
        <DocumentLoader />
      ) : (
        <>
          <DocumentCanvas
            width={width}
            canvasRef={ref}
            url={url}
            isLoadingPdf={isLoadingPdf}
            setIsLoadingPdf={setIsLoadingPdf}
          />
          {showDocumentOverlays && [
            <Cursors key={"cursors"} canvasRef={ref} />,
            <Threads key={"threads"} canvasRef={ref} />,
          ]}
        </>
      )}
      <ThreadsComposer canvasRef={ref} />
    </div>
  );
};

const MemoizedDocument = memo(Document);

export default MemoizedDocument;
