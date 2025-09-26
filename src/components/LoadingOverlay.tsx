import React from 'react';
interface LoadingOverlayProps {
  isLoading: boolean;
}
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading
}) => {
  if (!isLoading) return null;
  return <div className="fixed inset-0 z-50 bg-[#0a0a12]/80 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 rounded-full border-4 border-t-transparent border-violet-500 animate-spin"></div>
        <p className="mt-4 text-zinc-300 text-sm">Betöltés...</p>
      </div>
    </div>;
};