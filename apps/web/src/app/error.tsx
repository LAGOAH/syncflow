'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong!</h2>
        <p className="text-sm text-red-700 mb-4 font-mono break-all">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
