"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<{ code?: string; message?: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Récupérer la partie après le hash (#) et analyser les paramètres
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const errorCode = hashParams.get("error_code");
      const errorMessage = hashParams.get("error_description");

      if (errorCode || errorMessage) {
        setError({
          code: errorCode || "unknown_error",
          message: errorMessage || "An unknown error occurred",
        });
      }
    }
  }, []);

  return (
    <div className="w-full flex justify-center flex-col items-center px-8 sm:max-w-lg mx-auto mt-8">

      <p className=" font-bold text-2xl">Ouups ....</p>


      {error ? (
        <div className=" bg-red-100 border  p-4 rounded-md">
          <p className="font-semibold text-center">Error: {error.code}</p>
          {error.message && <p>{decodeURIComponent(error.message)}</p> }
      
        </div>
      ) : (
        <p className="text-gray-700">Sorry, something went wrong.</p>
      )}
    </div>
  );
}
