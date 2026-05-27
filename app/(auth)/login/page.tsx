"use client";

import { Role } from "@/prisma/generated/prisma/enums";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { loginInputSchema } from "@/validation/loginFormSchema";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<loginInputSchema>();

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
      setError(data.message);
      toast.error(data.error || "Login Failed");
      return;
    }
    if (data.data.role === Role.CLINIC) {
      toast.success("Login Successfull as Clinic");
      router.push("/home");
      return;
    }
    toast.success("Login In");
    router.push("/user");
  };

  return (
    <form
      onSubmit={loginLogic}
      className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm flex flex-col gap-5"
    >
      <h2 className="text-2xl font-bold text-center">Login</h2>

      <input
        name="email"
        type="text"
        placeholder="Email"
        className="border p-2 rounded"
      />
      {error && <p className="text-sm text-red-500">{error.email}</p>}
      <input
        name="password"
        type="password"
        placeholder="Password"
        className="border p-2 rounded"
      />
      {error && <span className="text-sm text-red-500">{error.password}</span>}
      <button
        disabled={loading}
        className="bg-blue-700 text-white p-2 rounded cursor-pointer disabled:bg-gray-500"
      >
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
