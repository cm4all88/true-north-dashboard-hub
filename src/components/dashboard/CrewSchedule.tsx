
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
            <div key={weekIndex} className={weekIndex > 0 ? "mt-4" : ""}>
              <div className="font-bold text-gray-300 text-sm mb-2">{weekData.weekOf}</div>
              <Table className="border-collapse text-sm">
                <TableHeader className="bg-gray-700">
                  <TableRow>
                    <TableHead className="w-24 text-sm font-bold text-white p-2 border border-gray-600">Date</TableHead>
                    {weekData.crews.map((crew, crewIndex) => (
                      <TableHead 
                        key={`${crew.position}-${crewIndex}`} 
                        className="text-sm font-bold text-white p-2 border border-gray-600 text-center min-w-[120px]"
                      >
                        <div className="font-bold">{crew.position}</div>
                        <div className="text-xs text-gray-300 font-normal">{crew.name}</div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weekData.days.map((day, dayIndex) => (
                    <TableRow key={`${day}-${dayIndex}`} className={`${day === currentDay ? 'bg-gray-600' : ''} h-[60px]`}>
                      <TableCell className="p-2 border border-gray-600 font-medium">
                        <div className={`font-bold text-sm ${day === currentDay ? 'text-white' : 'text-gray-300'}`}>
                          {day.slice(0, 3)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {weekData.dates[dayIndex].split('/').slice(0, 2).join('/')}
                        </div>
                      </TableCell>
                      {weekData.crews.map((crew, crewIndex) => (
                        <TableCell 
                          key={`${crewIndex}-${dayIndex}`} 
                          className="p-2 border border-gray-600 text-center"
                        >
                          {crew.schedule[dayIndex]?.jobCode !== undefined && (
                            <div className="space-y-1">
                              <div className="font-medium text-sm text-white">
                                {crew.schedule[dayIndex].jobCode}
                              </div>
                              {crew.schedule[dayIndex].description && (
                                <div className="text-gray-300 text-xs">
                                  {crew.schedule[dayIndex].description}
                                </div>
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
