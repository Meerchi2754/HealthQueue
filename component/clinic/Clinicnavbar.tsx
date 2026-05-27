"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ClinicNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname.includes(path);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
      toast.success("Logout Successfull");
      router.push("/user");
    } catch (error) {
      toast.error(`${error}`);
      console.log("Logout failed");
    }
  };

  return (
    <div className="flex flex-row gap-3 justify-between px-10 py-4 shadow-2xs">
      {/* Logo */}
      <div className="text-2xl font-bold">
        <h2>
          Clinic<span className="text-blue-600">Queue</span>
        </h2>
      </div>

      {/* Navigation */}
      <ul className="flex flex-row gap-3 items-center font-bold">
        <Link
          href="/home"
          className={`hover:text-blue-800 ${
            isActive("/home") ? "text-blue-600 font-bold" : ""
          }`}
        >
          Dashboard
        </Link>

        <Link
          href="/doctorList"
          className={`hover:text-blue-800 ${
            isActive("/doctorList") ? "text-blue-600 font-bold" : ""
          }`}
        >
          Edit Doctor
        </Link>
      </ul>

      {/* Logout */}
      <div>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
