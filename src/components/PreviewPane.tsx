import React from 'react';

interface PreviewPaneProps {
  code?: string;
}

export function PreviewPane({ code }: PreviewPaneProps) {
  const src = code || '<div />';
  // Simple preview using an iframe; sandboxed for safety.
  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold">Preview</div>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden rounded-md border border-charcoal-lighter bg-white">
        <iframe className="w-full h-full" title="preview" sandbox="allow-scripts allow-same-origin" srcDoc={src} />
      </div>
    </div>
  );
}

export default PreviewPane;
