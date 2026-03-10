import { JwtPayload } from "@/types";
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "7h";

export function createToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
}
