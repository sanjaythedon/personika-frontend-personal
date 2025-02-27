'use client'

import { notFound } from "next/navigation"
import PatientSummary from "./PatientSummary"
import { useEffect, useState, useRef } from "react"

async function getPatientData(id: string, module: string) {
  try {
    console.log("Fetching data for:", id, module)
    const response = await fetch(`https://api-personika.babymd.in/summary/${module}?phone_number=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache',
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

export default function Page({ params }: { params: { slug: string[] } }) {
  console.log("Params:", params)
  const [patientData, setPatientData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const dataFetchedRef = useRef(false);

  const strippedId = params.slug[1].slice(-10)
  console.log("Original ID:", params.slug[1])
  console.log("Stripped ID:", strippedId)

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    
    async function fetchData() {
      try {
        const data = await getPatientData(strippedId, params.slug[0]);
        if (!data) {
          notFound();
        }
        setPatientData(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [params.slug, strippedId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!patientData) {
    return null;
  }

  return <PatientSummary patient={patientData} />
}

