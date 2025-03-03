'use server'

import { revalidateTag } from 'next/cache';


export async function getPatientData(id: string, module: string) {
  try {
    if (!id.startsWith('+91')) {
      id = `+91${id}`;
    }

    const timestamp = new Date().toISOString();
    
    console.log(`[${timestamp}] SERVER: Fetching fresh data for: ${id}, ${module}`);
    
    const response = await fetch(`https://api-personika.babymd.in/summary/${module}?phone_number=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Still use Next.js caching as a backup
      next: { 
        tags: [`patient-${id}-${module}`],
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch patient data: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('Error fetching patient data:', error);
    throw error;
  }
}


export async function testServerAction() {
  console.log("Test server action executed at:", new Date().toISOString());
  return { success: true, time: new Date().toISOString() };
} 