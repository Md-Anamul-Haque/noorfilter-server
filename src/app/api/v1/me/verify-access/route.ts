import { NextRequest, NextResponse } from "next/server";
import { headers } from 'next/headers'
import { signAccessToken } from "@/lib/jwt";

type ResData = {
  is_valid: boolean;
  valid_until: number;
  error?: string;
  token?: string
}
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}
export async function GET() {
  const headersList = await headers()
  const bearerToken = headersList.get('Authorization')
  const token = bearerToken?.split(' ')[1] || null;
  if (!token) {
    const resData: ResData = {
      is_valid: false,
      valid_until: 0,
      error: "Membership expired or invalid token",
    }
    return NextResponse.json(resData, { status: 401, headers: corsHeaders });
  }
  const userId = "user123"; // উদাহরণস্বরূপ, এটি ডাটাবেস থেকে আসা ইউজারের আইডি হতে পারে
  const new_token = await signAccessToken({
    userId
  }, '20d')
  const dbExpiryDate = new Date()
  dbExpiryDate.setHours(dbExpiryDate.getHours() + 1); // 1 hour from now
  const userValidUntil = Math.floor(dbExpiryDate.getTime() / 1000); // Convert to Unix Timestamp (Seconds)
  const resData: ResData = {
    is_valid: true,
    valid_until: userValidUntil,
    token: new_token
  }
  return NextResponse.json(resData, { status: 200, headers: corsHeaders });
}


// const dbExpiryDate = "2024-12-31T23:59:59.000Z"; // অথবা new Date() অবজেক্ট

// // Date টিকে Unix Timestamp (Seconds) এ কনভার্ট করা
// const userValidUntil = Math.floor(new Date(dbExpiryDate).getTime() / 1000);
// const dbExpiryDate = new Date()
// dbExpiryDate.setHours(dbExpiryDate.getHours() + 1); // 1 hour from now
// const userValidUntil = Math.floor(dbExpiryDate.getTime() / 1000); // Convert to Unix Timestamp (Seconds)