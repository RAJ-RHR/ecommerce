// /app/api/delete-image/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { publicId } = await req.json();

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = require('crypto')
    .createHash('sha1')
    .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
    .digest('hex');

  const formData = new URLSearchParams({
    public_id: publicId,
    api_key: apiKey!,
    timestamp: String(timestamp),
    signature,
  });

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  return NextResponse.json(data);
}
