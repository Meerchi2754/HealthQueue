"use client";

import { Role } from "@/app/generated/prisma/enums";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const loginLogic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // IMPORTANT
      },
      body: JSON.stringify({
        email,
        password,
      }),
      credentials: "include", // allow cookie
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      toast.error(data.message || "Error in Login");
      return;
    }
    if (data.data.role === Role.CLINIC) {
      toast.success("Login Successfull as Clinic");
      router.push("/home");
      return;
    }
    toast.success("Login In");
    router.push("/dashboard/user");
  };

  return (
    <form
      onSubmit={loginLogic}
      className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm flex flex-col gap-5"
    >
      <h2 className="text-2xl font-bold text-center">Login</h2>

      <input
        name="email"
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        className="border p-2 rounded"
      />

      <button className="bg-blue-700 text-white p-2 rounded cursor-pointer">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Logining...
          </span>
        ) : (
          <p>Login</p>
        )}
      </button>

      <p className="text-sm text-center">
        Don't have an account?{" "}
        <Link href="/register" className="text-blue-600">
          Sign Up
        </Link>
      </p>
    </form>
  );
}
