import { createHmac, createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const CUSTOMER_COOKIE = "nordic_customer_session";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, savedHash] = stored.split(":");
  if (!salt || !savedHash) return false;
  const hash = scryptSync(password, salt, 64).toString("hex");
  return hash.length === savedHash.length && timingSafeEqual(Buffer.from(hash), Buffer.from(savedHash));
}

export function createCustomerSession(username: string) {
  const secret = process.env.CUSTOMER_SESSION_SECRET || "change-this-customer-secret";
  const payload = `${username}:${Date.now()}`;
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64url")}.${signature}`;
}

export function isValidCustomerSession(value?: string) {
  if (!value) return false;
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return false;
  const secret = process.env.CUSTOMER_SESSION_SECRET || "change-this-customer-secret";
  const expected = createHmac("sha256", secret).update(Buffer.from(encoded, "base64url").toString("utf8")).digest("hex");
  return signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export function getCustomerUsername(request: Request) {
  const cookie = request.headers.get("cookie")?.split(";").map(item => item.trim()).find(item => item.startsWith(`${CUSTOMER_COOKIE}=`));
  const value = cookie?.slice(CUSTOMER_COOKIE.length + 1);
  if (!isValidCustomerSession(value)) return null;
  return Buffer.from(value!.split(".")[0], "base64url").toString("utf8").split(":")[0] || null;
}
