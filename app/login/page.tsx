"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginLogic = async () => {
    console.log("start");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    const data = await res.json();
    console.log(data);
    setEmail("");
    setPassword("");
    console.log("password");
    router.push("/");
  };

  return (
    <>
      <div className="flex  min-h-screen flex-col items-center justify-center gap-2">
        <h1>Login Pages</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="bg-white text-black"
              onChange={(e) => {
                console.log("Email:", e.target.value);
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-row gap-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="bg-white text-black"
              onChange={(e) => {
                console.log("Password:", e.target.value);
                setPassword(e.target.value);
              }}
            />
          </div>
          <button
            className="bg-blue-800 text-white p-3 rounded-2xl"
            type="submit"
            onClick={loginLogic}
          >
            Login
          </button>
          <div className="flex flex-row gap-2">
            <label>Don't have an account?</label>
            <Link href={"/register"} className="text-blue-500">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
