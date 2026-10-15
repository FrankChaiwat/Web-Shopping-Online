import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "nordic_admin_session";

function secret() {
  return process.env.ADMIN_SESSION_SECRET || "change-this-admin-secret";
}

export function createAdminSession(username: string) {
  const payload = `${username}:${Date.now()}`;
  const signature = createHmac("sha256", secret())
    .update(payload)
    .digest("hex");
  return `${Buffer.from(payload).toString("base64url")}.${signature}`;
}

export function isValidAdminSession(value?: string) {
  if (!value) return false;
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return false;
  try {
    const payload = Buffer.from(encoded, "base64url").toString("utf8");
    const expected = createHmac("sha256", secret())
      .update(payload)
      .digest("hex");
    return (
      signature.length === expected.length &&
      timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    );
  } catch {
    return false;
  }
}

export function isAdminRequest(request: Request) {
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${ADMIN_COOKIE}=`));
  return isValidAdminSession(cookie?.slice(ADMIN_COOKIE.length + 1));
}
