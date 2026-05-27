"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6">
      <div className="text-center max-w-lg">
        {/* Logo / Title */}
        <h1 className="text-5xl font-bold text-blue-700 mb-4">HealthQueue</h1>

        {/* 404 */}
        <h2 className="text-6xl font-extrabold text-gray-800 mb-3">404</h2>

        <p className="text-lg text-gray-600 mb-6">
          Oops! The page you're looking for doesn’t exist or may have been
          moved.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/user"
            className="bg-blue-700 text-white px-5 py-2 rounded-md hover:bg-blue-800 transition"
          >
            Go Home
          </Link>

          <Link
            href="/login"
            className="border border-blue-700 text-blue-700 px-5 py-2 rounded-md hover:bg-blue-50 transition"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Footer */}
      <p className="absolute bottom-6 text-sm text-gray-500">
        © {year || "2026"} HealthQueue. All rights reserved.
      </p>
    </div>
  );
}
