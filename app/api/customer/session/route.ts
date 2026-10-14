import { NextResponse } from "next/server";
import { CUSTOMER_COOKIE, getCustomerUsername, isValidCustomerSession } from "@/lib/customer-auth";

export async function GET(request: Request) {
  const cookie = request.headers.get("cookie")?.split(";").map(item => item.trim()).find(item => item.startsWith(`${CUSTOMER_COOKIE}=`));
  const value = cookie?.slice(CUSTOMER_COOKIE.length + 1);
  return NextResponse.json({ authenticated: isValidCustomerSession(value), username: getCustomerUsername(request) });
}
