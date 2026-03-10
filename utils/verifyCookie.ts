"use server";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function verifyCookie() {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  const user = verifyToken(token);
  return user;
}
