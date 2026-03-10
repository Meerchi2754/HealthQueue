import { cookies } from "next/headers";
export async function checkCookie() {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return false;
  }
  return true;
}
