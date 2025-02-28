import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { tag, secret } = await request.json();
    
    // Optional: Add a secret to protect your revalidation API
    const expectedSecret = process.env.REVALIDATION_SECRET;
    if (secret !== expectedSecret) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }
    
    if (!tag) {
      return NextResponse.json({ message: 'Tag is required' }, { status: 400 });
    }
    
    revalidateTag(tag);
    return NextResponse.json({ revalidated: true, message: `Revalidated tag: ${tag}` });
  } catch (error) {
    return NextResponse.json({ message: 'Error revalidating', error }, { status: 500 });
  }
} 