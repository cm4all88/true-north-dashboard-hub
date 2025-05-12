
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";

// Structured data that matches the Excel format
const crewScheduleData = {
  weekOf: "May 12 - May 18, 2025",
  days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
  dates: ["5/12/2025", "5/13/2025", "5/14/2025", "5/15/2025", "5/16/2025", "5/17/2025", "5/18/2025"],
  crews: [
    {
      position: "PC IP",
      name: "",
      schedule: [
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
      ]
    },
    {
      position: "TIM",
      name: "SHAUN",
      schedule: [
        { jobCode: "j18-18", description: "test" },
        { jobCode: "j18-18", description: "test" },
        { jobCode: "j18-183", description: "test" },
        { jobCode: "j18-184", description: "test" },
        { jobCode: "j18-185", description: "test" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
      ]
    },
    {
      position: "NOTES",
      name: "",
      schedule: [
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
      ]
    },
    {
      position: "TAYLOR",
      name: "GERRY",
      schedule: [
        { jobCode: "j19-18", description: "test" },
        { jobCode: "j19-18", description: "test" },
        { jobCode: "j19-183", description: "test" },
        { jobCode: "j19-184", description: "test" },
        { jobCode: "j19-185", description: "test" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
      ]
    },
    {
      position: "NOTES",
      name: "",
      schedule: [
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
      ]
    },
    {
      position: "DOMINIC",
      name: "SERGIO",
      schedule: [
        { jobCode: "j20-11", description: "test" },
        { jobCode: "j20-11", description: "test" },
        { jobCode: "j20-113", description: "test" },
        { jobCode: "j20-114", description: "test" },
        { jobCode: "j20-115", description: "test" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
      ]
    },
    {
      position: "NOTES",
      name: "",
      schedule: [
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
      ]
    },
  ]
};

// Function to get the current day name
const getCurrentDayName = () => {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const today = new Date().getDay();
  return days[today];
};

export function CrewSchedule() {
  const currentDay = getCurrentDayName();
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-truenorth-700 text-lg">
          <Calendar className="h-4 w-4" />
          Field Crew Schedule
        </CardTitle>
        <CardDescription>{crewScheduleData.weekOf}</CardDescription>
      </CardHeader>
      <CardContent className="p-2 overflow-auto">
        <Table className="border-collapse">
          <TableHeader className="bg-blue-50">
            <TableRow>
              <TableHead className="w-24 text-xs font-bold text-truenorth-700 p-1 border">Crew</TableHead>
              {crewScheduleData.days.map((day, index) => (
                <TableHead 
                  key={day} 
                  className={`w-24 text-xs font-bold p-1 border text-center ${day === currentDay ? 'bg-truenorth-100 text-truenorth-700' : 'text-truenorth-600'}`}
                >
                  {day}
                  <div className="text-[10px] text-truenorth-500">{crewScheduleData.dates[index]}</div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {crewScheduleData.crews.map((crew, crewIndex) => (
              <TableRow key={`${crew.position}-${crewIndex}`} className={crew.position === "NOTES" ? "bg-gray-50 h-6" : ""}>
                <TableCell className="p-1 border text-xs align-top">
                  <div className="font-bold">{crew.position}</div>
                  <div className="text-xs">{crew.name}</div>
                </TableCell>
                {crew.schedule.map((day, dayIndex) => (
                  <TableCell 
                    key={`${crewIndex}-${dayIndex}`} 
                    className={`p-1 border text-[10px] align-top ${crewScheduleData.days[dayIndex] === currentDay ? 'bg-truenorth-50' : ''}`}
                  >
                    {day.jobCode && (
                      <>
                        <div className="font-medium">{day.jobCode}</div>
                        <div className="text-truenorth-500">{day.description}</div>
                      </>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
