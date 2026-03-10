"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
export function Navbar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.includes(path);
  return (
    <>
      <div className="flex flex-row gap-3 justify-between">
        <div>
          <h2>HealthQueue</h2>
        </div>
        <ul className="flex flex-row gap-3">
          <Link
            href="/dashboard/user"
            className={
              isActive("/dashboard/user") ? "text-blue-500 font-bold" : ""
            }
          >
            Home
          </Link>
          <Link
            href="/appointment"
            className={
              isActive("/appointment") ? "text-blue-500 font-bold" : ""
            }
          >
            Appointment
          </Link>
          <Link
            href="/history"
            className={isActive("/history") ? "text-blue-500 font-bold" : ""}
          >
            History
          </Link>
          <Link
            href="/about"
            className={isActive("/about") ? "text-blue-500 font-bold" : ""}
          >
            About
          </Link>
        </ul>
        <div className="flex flex-row gap-3">
          <button>Login In</button>
          <button>Sign Up</button>
        </div>
      </div>
    </>
  );
}
