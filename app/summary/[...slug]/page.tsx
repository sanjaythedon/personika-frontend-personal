'use client'

import { notFound } from "next/navigation"
import PatientSummary from "./PatientSummary"
import { useEffect, useState, useRef } from "react"
import { getPatientData } from "../actions"

export default function Page({ params }: { params: { slug: string[] } }) {
  console.log("Params:", params)
  
  const strippedId = params.slug[1].slice(-10)
  console.log("Original ID:", params.slug[1])
  console.log("Stripped ID:", strippedId)

  const [patientData, setPatientData] = useState(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const dataFetchedRef = useRef(false)
  const [fetchTime, setFetchTime] = useState<string | null>(null)

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    
    async function fetchData() {
      try {
        const startTime = new Date();
        const data = await getPatientData(strippedId, params.slug[0]);
        const endTime = new Date();
        setFetchTime(`Fetched at: ${startTime.toISOString()}, took ${endTime.getTime() - startTime.getTime()}ms`);
        
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
    return <div>No patient data found</div>;
  }

  return (
    <div>
      <PatientSummary patient={patientData} />
    </div>
  );
}
