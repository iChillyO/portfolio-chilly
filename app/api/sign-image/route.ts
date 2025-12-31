import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiSecret) {
    console.error("CLOUDINARY_API_SECRET is not set.");
    return NextResponse.json(
      { success: false, error: "Server configuration error: Cloudinary API secret is missing." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { paramsToSign } = body;

    if (!paramsToSign) {
      return NextResponse.json(
        { success: false, error: "Missing parameters to sign" },
        { status: 400 }
      );
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      apiSecret
    );
    
    return NextResponse.json({ success: true, signature });
  } catch (error) {
    console.error("Error signing image upload request:", error);
    return NextResponse.json(
      { success: false, error: "Failed to sign request" },
      { status: 500 }
    );
  }
}
