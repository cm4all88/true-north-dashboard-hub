
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDashboardData } from '@/contexts/DashboardDataContext';

// Function to get the current day name
const getCurrentDayName = () => {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const today = new Date().getDay();
  return days[today];
};

export function CrewSchedule() {
  const { data } = useDashboardData();
  const currentDay = getCurrentDayName();
  
  return (
    <Card className="h-full bg-gray-800">
      <CardHeader className="pb-1 px-3 py-2">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <Calendar className="h-4 w-4" />
          Field Crew Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <ScrollArea className="h-[calc(100%-50px)]">
          {data.scheduleData.map((weekData, weekIndex) => (
            <div key={weekIndex} className={weekIndex > 0 ? "mt-3" : ""}>
              <div className="font-bold text-gray-300 text-sm mb-2">{weekData.weekOf}</div>
              <Table className="border-collapse text-xs">
                <TableHeader className="bg-gray-700">
                  <TableRow>
                    <TableHead className="w-16 text-xs font-bold text-white p-1 border border-gray-600">Crew</TableHead>
                    {weekData.days.map((day, index) => (
                      <TableHead 
                        key={day + index} 
                        className={`w-16 text-xs font-bold p-1 border border-gray-600 text-center ${day === currentDay ? 'bg-gray-600 text-white' : 'text-gray-300'}`}
                      >
                        <div className="truncate">{day.slice(0, 3)}</div>
                        <div className="text-xs text-gray-400">{weekData.dates[index].split('/').slice(0, 2).join('/')}</div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weekData.crews.map((crew, crewIndex) => (
                    <TableRow key={`${weekIndex}-${crew.position}-${crewIndex}`} className={crew.position === "OFF" ? "bg-gray-700 h-[25px]" : "h-[45px]"}>
                      <TableCell className="p-1 border border-gray-600 align-top">
                        <div className="font-bold text-sm text-white truncate">{crew.position}</div>
                        <div className="text-xs font-medium text-gray-300 truncate">{crew.name}</div>
                      </TableCell>
                      {crew.schedule.map((day, dayIndex) => (
                        <TableCell 
                          key={`${crewIndex}-${dayIndex}`} 
                          className={`p-1 border border-gray-600 align-top ${weekData.days[dayIndex] === currentDay ? 'bg-gray-600' : ''}`}
                        >
                          {day.jobCode !== undefined && (
                            <div className="space-y-0.5">
                              <div className="font-medium text-xs text-white truncate">{day.jobCode}</div>
                              {day.description && (
                                <div className="text-gray-300 text-xs truncate">- {day.description}</div>
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
