"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (path: string) => pathname.includes(path);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/me");
      const data = await res.json();
      setIsLoggedIn(data.loggedIn);
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
      setIsLoggedIn(false);
      toast.success("Logout Successfull!");
      router.push("/dashboard/user"); // redirect
    } catch (error) {
      toast.error("Login Failed!");
      console.log("Logout failed");
    }
  };
  return (
    <>
      <div className="flex flex-row gap-3 justify-between px-10 py-4 shadow-2xs">
        <div className="text-2xl font-bold">
          <h2>
            Health<span className="text-blue-600">Queue</span>
          </h2>
        </div>
        <ul className="flex flex-row gap-3 items-center font-bold ">
          <Link
            href="/dashboard/user"
            className={`hover:text-blue-800 ${
              isActive("/dashboard/user") ? "text-blue-600 font-bold" : ""
            }`}
          >
            Home
          </Link>
          <Link
            href="/appointment"
            className={`hover:text-blue-800 ${
              isActive("/appointment") ? "text-blue-600 font-bold" : ""
            }`}
          >
            Appointment
          </Link>
          <Link
            href="/history"
            className={`hover:text-blue-800 ${
              isActive("/history") ? "text-blue-600 font-bold" : ""
            }`}
          >
            History
          </Link>
          <Link
            href="/about"
            className={`hover:text-blue-800 ${
              isActive("/about") ? "text-blue-600 font-bold" : ""
            }`}
          >
            About
          </Link>
        </ul>
        <div className="flex  gap-4">
          {isLoggedIn ? (
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login">
                <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md cursor-pointer">
                  Login
                </button>
              </Link>

              <Link href="/register">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
