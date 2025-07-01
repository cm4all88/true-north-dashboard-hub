
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

// Function to get Monday of current week
const getMondayOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
};

// Function to format date as M/D/YYYY
const formatDate = (date: Date) => {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

// Function to get week range string
const getWeekRange = (mondayDate: Date) => {
  const friday = new Date(mondayDate);
  friday.setDate(mondayDate.getDate() + 4);
  
  const mondayMonth = mondayDate.toLocaleDateString('en-US', { month: 'short' });
  const mondayDay = mondayDate.getDate();
  const fridayMonth = friday.toLocaleDateString('en-US', { month: 'short' });
  const fridayDay = friday.getDate();
  const year = mondayDate.getFullYear();
  
  return `${mondayMonth} ${mondayDay} - ${fridayMonth} ${fridayDay}, ${year}`;
};

// Generate current week data
const generateCurrentWeekData = () => {
  const currentMonday = getMondayOfWeek(new Date());
  const dates = [];
  
  for (let i = 0; i < 5; i++) {
    const date = new Date(currentMonday);
    date.setDate(currentMonday.getDate() + i);
    dates.push(formatDate(date));
  }
  
  return {
    weekOf: getWeekRange(currentMonday),
    days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
    dates,
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
};

// Generate next week data
const generateNextWeekData = () => {
  const nextMonday = getMondayOfWeek(new Date());
  nextMonday.setDate(nextMonday.getDate() + 7);
  const dates = [];
  
  for (let i = 0; i < 5; i++) {
    const date = new Date(nextMonday);
    date.setDate(nextMonday.getDate() + i);
    dates.push(formatDate(date));
  }
  
  return {
    weekOf: getWeekRange(nextMonday),
    days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
    dates,
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
};

// Function to get the current day name
const getCurrentDayName = () => {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const today = new Date().getDay();
  return days[today];
};

export function CrewSchedule() {
  const [scheduleData] = useState([generateCurrentWeekData(), generateNextWeekData()]);
  const currentDay = getCurrentDayName();
  
  return (
    <Card className="h-full bg-gray-800">
      <CardHeader className="pb-1">
        <CardTitle className="flex items-center gap-2 text-white text-xl">
          <Calendar className="h-5 w-5" />
          Field Crew Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <ScrollArea className="h-[calc(100%-60px)]">
          {scheduleData.map((weekData, weekIndex) => (
            <div key={weekIndex} className={weekIndex > 0 ? "mt-4" : ""}>
              <CardDescription className="font-bold text-gray-300 text-lg mb-2">{weekData.weekOf}</CardDescription>
              <Table className="border-collapse">
                <TableHeader className="bg-gray-700">
                  <TableRow>
                    <TableHead className="w-20 text-sm font-bold text-white p-2 border border-gray-600">Crew</TableHead>
                    {weekData.days.map((day, index) => (
                      <TableHead 
                        key={day + index} 
                        className={`w-20 text-sm font-bold p-2 border border-gray-600 text-center ${day === currentDay ? 'bg-gray-600 text-white' : 'text-gray-300'}`}
                      >
                        {day}
                        <div className="text-xs text-gray-400">{weekData.dates[index]}</div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weekData.crews.map((crew, crewIndex) => (
                    <TableRow key={`${weekIndex}-${crew.position}-${crewIndex}`} className={crew.position === "OFF" ? "bg-gray-700 h-[30px]" : "h-[60px]"}>
                      <TableCell className="p-2 border border-gray-600 align-top">
                        <div className="font-bold text-lg text-white">{crew.position}</div>
                        <div className="text-sm font-medium text-gray-300">{crew.name}</div>
                      </TableCell>
                      {crew.schedule.map((day, dayIndex) => (
                        <TableCell 
                          key={`${crewIndex}-${dayIndex}`} 
                          className={`p-2 border border-gray-600 align-top ${weekData.days[dayIndex] === currentDay ? 'bg-gray-600' : ''}`}
                        >
                          {day.jobCode !== undefined && (
                            <div className="flex flex-col gap-1">
                              <div className="space-y-1">
                                <div className="font-medium text-sm text-white">{day.jobCode}</div>
                                {day.description && (
                                  <div className="text-gray-300 text-xs">- {day.description}</div>
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
