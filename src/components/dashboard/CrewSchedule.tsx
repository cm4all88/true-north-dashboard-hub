
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Download } from "lucide-react";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

// Initial structured data for the first week
const initialWeekOneData = {
  weekOf: "May 12 - May 16, 2025",
  days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
  dates: ["5/12/2025", "5/13/2025", "5/14/2025", "5/15/2025", "5/16/2025"],
  crews: [
    {
      position: "TIM",
      name: "SHAUN",
      schedule: [
        { jobCode: "j18-18", description: "test" },
        { jobCode: "j18-18", description: "test" },
        { jobCode: "j18-183", description: "test" },
        { jobCode: "j18-184", description: "test" },
        { jobCode: "j18-185", description: "test" },
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
      ]
    },
    {
      position: "OFF",
      name: "",
      schedule: [
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
        { jobCode: "", description: "" },
      ]
    },
  ]
};

// Initial structured data for the second week
const initialWeekTwoData = {
  weekOf: "May 19 - May 23, 2025",
  days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
  dates: ["5/19/2025", "5/20/2025", "5/21/2025", "5/22/2025", "5/23/2025"],
  crews: [
    {
      position: "TIM",
      name: "SHAUN",
      schedule: [
        { jobCode: "j18-22", description: "test" },
        { jobCode: "j18-23", description: "test" },
        { jobCode: "j18-24", description: "test" },
        { jobCode: "j18-25", description: "test" },
        { jobCode: "j18-26", description: "test" },
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
      ]
    },
    {
      position: "OFF",
      name: "",
      schedule: [
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

// Function to export daily schedule as CSV
const exportDayAsCSV = (weekData: any, dayIndex: number) => {
  const dayName = weekData.days[dayIndex];
  const date = weekData.dates[dayIndex];
  
  let csvContent = `Crew Schedule for ${dayName} ${date}\n`;
  csvContent += `Crew Member,Position,Job Code,Description\n`;
  
  weekData.crews.forEach((crew: any) => {
    const daySchedule = crew.schedule[dayIndex];
    csvContent += `${crew.name},${crew.position},${daySchedule.jobCode},${daySchedule.description}\n`;
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `crew-schedule-${dayName.toLowerCase()}-${date.replace(/\//g, '-')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export function CrewSchedule() {
  const [scheduleData] = useState([initialWeekOneData, initialWeekTwoData]);
  const currentDay = getCurrentDayName();
  
  return (
    <Card className="h-full bg-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white text-2xl">
          <Calendar className="h-6 w-6" />
          Field Crew Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <ScrollArea className="h-[calc(100vh-200px)]">
          {scheduleData.map((weekData, weekIndex) => (
            <div key={weekIndex} className={weekIndex > 0 ? "mt-6" : ""}>
              <div className="flex justify-between items-center mb-3">
                <CardDescription className="font-bold text-gray-300 text-xl">{weekData.weekOf}</CardDescription>
                <div className="flex gap-2">
                  {weekData.days.map((day, dayIndex) => (
                    <Button
                      key={`export-${weekIndex}-${dayIndex}`}
                      variant="outline"
                      size="sm"
                      onClick={() => exportDayAsCSV(weekData, dayIndex)}
                      className="text-xs"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      {day}
                    </Button>
                  ))}
                </div>
              </div>
              <Table className="border-collapse">
                <TableHeader className="bg-gray-700">
                  <TableRow>
                    <TableHead className="w-24 text-lg font-bold text-white p-3 border border-gray-600">Crew</TableHead>
                    {weekData.days.map((day, index) => (
                      <TableHead 
                        key={day + index} 
                        className={`w-24 text-lg font-bold p-3 border border-gray-600 text-center ${day === currentDay ? 'bg-gray-600 text-white' : 'text-gray-300'}`}
                      >
                        {day}
                        <div className="text-sm text-gray-400">{weekData.dates[index]}</div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weekData.crews.map((crew, crewIndex) => (
                    <TableRow key={`${weekIndex}-${crew.position}-${crewIndex}`} className={crew.position === "OFF" ? "bg-gray-700 h-[40px]" : "h-[80px]"}>
                      <TableCell className="p-4 border border-gray-600 align-top">
                        <div className="font-bold text-xl text-white">{crew.position}</div>
                        <div className="text-lg font-medium text-gray-300">{crew.name}</div>
                      </TableCell>
                      {crew.schedule.map((day, dayIndex) => (
                        <TableCell 
                          key={`${crewIndex}-${dayIndex}`} 
                          className={`p-4 border border-gray-600 align-top ${weekData.days[dayIndex] === currentDay ? 'bg-gray-600' : ''}`}
                        >
                          {day.jobCode !== undefined && (
                            <div className="flex flex-col gap-2">
                              <div className="space-y-1">
                                <div className="font-medium text-lg text-white">{day.jobCode}</div>
                                {day.description && (
                                  <div className="text-gray-300 text-lg">- {day.description}</div>
                                )}
                              </div>
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
