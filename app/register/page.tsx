"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const registerLogic = async () => {
    console.log("start");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, name: name, password: password }),
    });
    const data = await res.json();
    console.log(data);
    console.log("password");
    setEmail("");
    setName("");
    setPassword("");
    router.push("/login");
  };
  return (
    <>
      <div className="flex  min-h-screen flex-col items-center justify-center gap-2">
        <h1>Signup Pages</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="bg-white text-black"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-row gap-3">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="bg-white text-black"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-row gap-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="bg-white text-black"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <button
            className="bg-blue-800 text-white p-3 rounded-2xl "
            type="submit"
            onClick={registerLogic}
          >
            Sign Up
          </button>
        </div>

        <div className="flex flex-row gap-2">
          <label>Already have an account?</label>
          <Link href={"/login"} className="text-blue-500">
            Login in
          </Link>
        </div>
      </div>
    </>
  );
}
