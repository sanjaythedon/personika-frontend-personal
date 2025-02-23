"use client"

import { useState, useEffect } from "react"

type InteractionHistory = {
  date_time: string
  call_summary: string
}

type PatientData = {
  baby_name: string
  age: string
  parent_name: string
  mobile_number: string
  source: string
  sub_source: string
  summary: {
    lead_status: string
    concern: string
    interaction_history: InteractionHistory[]
  }
}

export default function PatientSummary({ patient }: { patient: PatientData }) {
  const parseCustomDate = (dateStr: string) => {
    const [datePart, timePart] = dateStr.split(' at ');
    return new Date(datePart + ' ' + timePart);
  };

  const sortedInteractionHistory = [...patient.summary.interaction_history].sort((a, b) => 
    parseCustomDate(b.date_time).getTime() - parseCustomDate(a.date_time).getTime()
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-8 overflow-hidden">
        <h1 className="text-3xl font-bold mb-6">Patient Summary</h1>
        <div className="flex">
          <div className="w-1/2 pr-4 sticky top-0">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
              <p>
                <strong>Baby Name:</strong> {patient.baby_name}
              </p>
              <p>
                <strong>Age:</strong> {patient.age}
              </p>
              <p>
                <strong>Parent Name:</strong> {patient.parent_name}
              </p>
              <p>
                <strong>Mobile Number:</strong> {patient.mobile_number}
              </p>
              <p>
                <strong>Source:</strong> {patient.source}
              </p>
              <p>
                <strong>Sub Source:</strong> {patient.sub_source}
              </p>
              <p>
                <strong>Lead Status:</strong> {patient.summary.lead_status}
              </p>
              <p>
                <strong>Concern:</strong> {patient.summary.concern}
              </p>
            </div>
          </div>
          <div className="w-1/2 pl-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 2rem)" }}>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Interaction History</h2>
              {sortedInteractionHistory.map((interaction, index) => (
                <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                  <div>
                    <strong>Date and Time:</strong>
                    <p>
                      {interaction.date_time}
                    </p>
                  </div>
                  <div>
                    <strong>Call Summary:</strong>
                    <p>
                      {interaction.call_summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

