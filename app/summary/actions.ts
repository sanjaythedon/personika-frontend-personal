'use server'



export async function getPatientData(module: string, queryString: string, mobile: string | null) {
  try {

    const timestamp = new Date().toISOString();
    
    console.log(`[${timestamp}] SERVER: Fetching fresh data for: ${mobile}, ${module}`);

    // const mainUrl = `http://localhost:8000/summary/${module}`
    const mainUrl = `https://api-personika.babymd.in/summary/${module}`
    
    const response = await fetch(`${mainUrl}?${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Still use Next.js caching as a backup
      next: { 
        tags: [`patient-${mobile}-${module}`],
        revalidate: 86400
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