import { verifyOTP } from "@/lib/verifyOTP";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest)
{
  const {email, otp} = await request.json();

  if (!email || !otp) 
    return NextResponse.json({message:"Missing email or OTP"}, {status: 400})
  
  const result = await verifyOTP(email, otp);
  if(!result)
    return NextResponse.json({message:"Invalid OTP"}, {status: 400})

  return NextResponse.json({message:"Your Account are verified"})
}