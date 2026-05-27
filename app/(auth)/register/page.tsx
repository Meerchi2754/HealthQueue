"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { registerFormSchema } from "@/validation/registerFormSchema";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<registerFormSchema>();

  const registerLogic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const name = formData.get("name");
    const password = formData.get("password");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setLoading(false);
      setError(data.message);
      toast.error(data.error || "Register Failed");
      return;
    }
    toast.success("Register Successfull");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Sign Up</h1>

      <form
        onSubmit={registerLogic}
        className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow"
      >
        <div className="flex flex-col">
          <label>Email</label>
          <input
            name="email"
            type="text"
            className="border px-3 py-2 rounded"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error.email}</p>}
        <div className="flex flex-col">
          <label>Username</label>
          <input
            name="name"
            type="text"
            className="border px-3 py-2 rounded"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error.name}</p>}
        <div className="flex flex-col">
          <label>Password</label>
          <input
            name="password"
            type="password"
            className="border px-3 py-2 rounded"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error.password}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
        >
          Sign Up
        </button>

        <div className="flex gap-2 text-sm">
          <span>Already have an account?</span>
          <Link href="/login" className="text-blue-500">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
