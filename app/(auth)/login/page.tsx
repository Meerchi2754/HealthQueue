"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const loginLogic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      alert(data.message);
      return;
    }

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

      <button className="bg-blue-700 text-white p-2 rounded">Login</button>

      <p className="text-sm text-center">
        Don't have an account?{" "}
        <Link href="/register" className="text-blue-600">
          Sign Up
        </Link>
      </p>
    </form>
  );
}
