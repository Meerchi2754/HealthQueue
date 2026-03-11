"use client";
import { useEffect, useState } from "react";

export default function Revenue() {
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);
  useEffect(() => {
    const getHistory = async () => {
      try {
        const response = await fetch("/api/getAmount");
        const data = await response.json();
        setRevenue(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getHistory();
  }, []);
  return (
    <>
      <div className="bg-white p-10 rounded-lg">
        <h1 className="text-2xl ">Revenue:</h1>
        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-10 w-10 rounded-full border-4 border-slate-200 border-t-blue-600"></div>
          </div>
        )}
        {!loading && (
          <p className="text-2xl font-bold text-green-700">{revenue}</p>
        )}
      </div>
    </>
  );
}
