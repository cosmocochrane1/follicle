import { useState, useEffect } from 'react';
import pdfjsLib from 'pdfjs-dist';

const useCreatePreview = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/[version]/pdf.worker.min.js';
    // Replace [version] with the specific version of pdf.js you are using
  }, []);

  const createPreview = (selector, pdfjsSrc) => {
    setIsLoading(true);

    const renderThumbnails = async (nodesArray) => {
      try {
        for (const element of nodesArray) {
          const filePath = element.getAttribute('data-pdf-thumbnail-file');
          const imgWidth = element.getAttribute('data-pdf-thumbnail-width');
          const imgHeight = element.getAttribute('data-pdf-thumbnail-height');

          const pdf = await pdfjsLib.getDocument({ url: filePath }).promise;
          const page = await pdf.getPage(1);
          const canvas = document.createElement("canvas");
          let viewport = page.getViewport({ scale: 1.0 });

          if (imgWidth) {
            viewport = page.getViewport({ scale: imgWidth / viewport.width });
          } else if (imgHeight) {
            viewport = page.getViewport({ scale: imgHeight / viewport.height });
          }

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({
            canvasContext: canvas.getContext('2d'),
            viewport: viewport
          }).promise;

          element.src = canvas.toDataURL();
        }
      } catch (err) {
        setError(`Error creating thumbnails: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    try {
      const nodesArray = Array.from(document.querySelectorAll(selector));
      if (!nodesArray.length) {
        setIsLoading(false);
        return;
      }

      if (typeof pdfjsLib === 'undefined') {
        const script = document.createElement('script');
        script.src = pdfjsSrc;
        document.head.appendChild(script).onload = () => renderThumbnails(nodesArray);
      } else {
        renderThumbnails(nodesArray);
      }
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }

  return {
    createPreview,
    isLoading,
    error,
  };
};

export default useCreatePreview;
