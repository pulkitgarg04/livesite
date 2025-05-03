'use client';

import React, { useEffect, useRef } from 'react';

interface LivePreviewProps {
  html: string;
  css: string;
  js: string;
}

const LivePreview: React.FC<LivePreviewProps> = ({ html, css, js }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    updateIframe();
  }, [html, css, js]);

  const updateIframe = () => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;

    if (!doc) return;

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>
            try {
              ${js}
            } catch (error) {
              console.error('Error in user script:', error);
            }
          </script>
        </body>
      </html>
    `;

    doc.open();
    doc.write(content);
    doc.close();
  };

  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-lg">
      <div className="bg-slate-700 text-white text-sm px-4 py-2 font-medium">
        Preview
      </div>
      <iframe
        ref={iframeRef}
        title="Preview"
        className="w-full h-[400px] border-none bg-white"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

export default LivePreview;