
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDashboardData } from '@/contexts/DashboardDataContext';

// Function to check if a date string matches today's date
const isToday = (dateString: string) => {
  const today = new Date();
  const targetDate = new Date(dateString);
  return today.toDateString() === targetDate.toDateString();
};

// Function to get color class
const getColorClass = (color: string) => {
  const colorMap: Record<string, string> = {
    'orange': 'bg-orange-500',
    'blue': 'bg-blue-500',
    'green': 'bg-green-500',
    'purple': 'bg-purple-500',
    'none': ''
  };
  return colorMap[color] || '';
};

export function CrewSchedule() {
  const { data } = useDashboardData();
  
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
                    <TableHead className="w-20 text-sm font-bold text-white p-2 border border-gray-600">Date</TableHead>
                    {weekData.crews.filter(crew => crew.position !== 'OFF').map((crew, crewIndex) => (
                      <TableHead 
                        key={`${crew.position}-${crewIndex}`} 
                        className="text-sm font-bold text-white p-2 border border-gray-600 text-center min-w-[180px]"
                      >
                        <div className="font-bold text-sm">{crew.position}</div>
                        <div className="text-xs text-gray-300 font-normal">{crew.name}</div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weekData.days.map((day, dayIndex) => (
                    <TableRow key={`${day}-${dayIndex}`} className={`${isToday(weekData.dates[dayIndex]) ? 'bg-gray-600' : ''} h-[85px]`}>
                      <TableCell className="p-2 border border-gray-600 font-medium">
                        <div>
                          <div className={`font-bold text-sm ${isToday(weekData.dates[dayIndex]) ? 'text-white' : 'text-gray-300'}`}>
                            {day.slice(0, 3)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {weekData.dates[dayIndex].split('/').slice(0, 2).join('/')}
                          </div>
                        </div>
                      </TableCell>
                      {weekData.crews.filter(crew => crew.position !== 'OFF').map((crew, crewIndex) => (
                        <TableCell 
                          key={`${crewIndex}-${dayIndex}`} 
                          className="p-3 border border-gray-600 text-center"
                        >
                          <div className="space-y-1">
                            {/* Row 1 */}
                            <div className="flex items-center justify-center gap-2 min-h-[22px]">
                              {crew.schedule[dayIndex]?.row1?.color && crew.schedule[dayIndex].row1.color !== 'none' && (
                                <div className={`w-3 h-3 rounded-full ${getColorClass(crew.schedule[dayIndex].row1.color)}`}></div>
                              )}
                              {crew.schedule[dayIndex]?.row1?.jobNumber && (
                                <div className="font-medium text-sm text-white">
                                  {crew.schedule[dayIndex].row1.jobNumber}
                                </div>
                              )}
                            </div>
                            {crew.schedule[dayIndex]?.row1?.jobName && (
                              <div className="text-gray-300 text-xs">
                                {crew.schedule[dayIndex].row1.jobName}
                              </div>
                            )}
                            
                            {/* Row 2 */}
                            <div className="flex items-center justify-center gap-2 min-h-[22px]">
                              {crew.schedule[dayIndex]?.row2?.color && crew.schedule[dayIndex].row2.color !== 'none' && (
                                <div className={`w-3 h-3 rounded-full ${getColorClass(crew.schedule[dayIndex].row2.color)}`}></div>
                              )}
                              {crew.schedule[dayIndex]?.row2?.jobNumber && (
                                <div className="font-medium text-sm text-white">
                                  {crew.schedule[dayIndex].row2.jobNumber}
                                </div>
                              )}
                            </div>
                            {crew.schedule[dayIndex]?.row2?.jobName && (
                              <div className="text-gray-300 text-xs">
                                {crew.schedule[dayIndex].row2.jobName}
                              </div>
                            )}
                          </div>
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
