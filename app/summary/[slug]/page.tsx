'use client'

import { notFound } from "next/navigation"
import PatientSummary from "./PatientSummary"
import { useEffect, useState, useRef } from "react"
import { getPatientData } from "../actions"
import { useSearchParams } from "next/navigation"


export default function Page({ params }: { params: { slug: string } }) {
  console.log("Params:", params)

  const queryParams = useSearchParams()

  const module = params.slug
  const queryString = queryParams.toString()
  let mobile = queryParams.get('mobile')
  if (mobile && !mobile.startsWith('+91')) {
    const strippedId = mobile.slice(-10)
    mobile = `+91${strippedId}`;
  }

  // const strippedId = mobile!.slice(-10)
  // console.log("Original ID:", mobile)
  // console.log("Stripped ID:", strippedId)

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
        const data = await getPatientData(module, queryString, mobile);
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
  }, [params.slug]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading patient data...</span>
      </div>
    );
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
