
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

// Structured data for the first week
const weekOneData = {
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

// Structured data for the second week
const weekTwoData = {
  weekOf: "May 19 - May 25, 2025",
  days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
  dates: ["5/19/2025", "5/20/2025", "5/21/2025", "5/22/2025", "5/23/2025", "5/24/2025", "5/25/2025"],
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
        { jobCode: "j18-22", description: "test" },
        { jobCode: "j18-23", description: "test" },
        { jobCode: "j18-24", description: "test" },
        { jobCode: "j18-25", description: "test" },
        { jobCode: "j18-26", description: "test" },
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
        { jobCode: "j19-22", description: "test" },
        { jobCode: "j19-23", description: "test" },
        { jobCode: "j19-24", description: "test" },
        { jobCode: "j19-25", description: "test" },
        { jobCode: "j19-26", description: "test" },
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
        { jobCode: "j20-22", description: "test" },
        { jobCode: "j20-23", description: "test" },
        { jobCode: "j20-24", description: "test" },
        { jobCode: "j20-25", description: "test" },
        { jobCode: "j20-26", description: "test" },
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

// Combined schedule data
const scheduleData = [weekOneData, weekTwoData];

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
      </CardHeader>
      <CardContent className="p-2">
        <ScrollArea className="h-[calc(100vh-200px)]">
          {scheduleData.map((weekData, weekIndex) => (
            <div key={weekIndex} className={weekIndex > 0 ? "mt-4" : ""}>
              <CardDescription className="mb-2 font-medium">{weekData.weekOf}</CardDescription>
              <Table className="border-collapse">
                <TableHeader className="bg-blue-50">
                  <TableRow>
                    <TableHead className="w-24 text-xs font-bold text-truenorth-700 p-1 border">Crew</TableHead>
                    {weekData.days.map((day, index) => (
                      <TableHead 
                        key={day + index} 
                        className={`w-24 text-xs font-bold p-1 border text-center ${day === currentDay ? 'bg-truenorth-100 text-truenorth-700' : 'text-truenorth-600'}`}
                      >
                        {day}
                        <div className="text-[10px] text-truenorth-500">{weekData.dates[index]}</div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weekData.crews.map((crew, crewIndex) => (
                    <TableRow key={`${weekIndex}-${crew.position}-${crewIndex}`} className={crew.position === "NOTES" ? "bg-gray-50 h-6" : ""}>
                      <TableCell className="p-1 border text-xs align-top">
                        <div className="font-bold">{crew.position}</div>
                        <div className="text-xs">{crew.name}</div>
                      </TableCell>
                      {crew.schedule.map((day, dayIndex) => (
                        <TableCell 
                          key={`${crewIndex}-${dayIndex}`} 
                          className={`p-1 border text-[10px] align-top ${weekData.days[dayIndex] === currentDay ? 'bg-truenorth-50' : ''}`}
                        >
                          {day.jobCode && (
                            <div className="flex items-center gap-1">
                              <div className="font-medium whitespace-nowrap">{day.jobCode}</div>
                              {day.description && (
                                <div className="text-truenorth-500">- {day.description}</div>
                              )}
                            </div>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
