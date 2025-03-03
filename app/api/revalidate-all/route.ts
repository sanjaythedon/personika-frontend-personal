import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json();
    
    // Verify the secret to protect your revalidation API
    const expectedSecret = process.env.REVALIDATION_SECRET;
    if (secret !== expectedSecret) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }
    
    // Revalidate the entire app by revalidating the root path with layout option
    revalidatePath('/', 'layout');
    
    return NextResponse.json({ 
      revalidated: true, 
      message: 'Successfully revalidated all cache' 
    });
  } catch (error) {
    return NextResponse.json({ 
      message: 'Error revalidating all cache', 
      error 
    }, { status: 500 });
  }
} 