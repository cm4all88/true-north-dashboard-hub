
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ArrowLeftRight } from "lucide-react";
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
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWeekIndex((prevIndex) => (prevIndex + 1) % data.scheduleData.length);
    }, 15000); // Change every 15 seconds

    return () => clearInterval(interval);
  }, [data.scheduleData.length]);

  const currentWeekData = data.scheduleData[currentWeekIndex];

  if (!currentWeekData) {
    return (
      <Card className="h-full bg-gray-800">
        <CardContent className="p-4 flex items-center justify-center">
          <div className="text-white text-2xl uppercase">No schedule data available</div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full bg-gray-800">
      <CardHeader className="pb-2 px-4 py-3">
        <CardTitle className="flex items-center gap-2 text-white text-2xl uppercase">
          <Calendar className="h-6 w-6" />
          Field Crew Schedule
          <ArrowLeftRight className="h-5 w-5 ml-2 text-gray-400" />
          <span className="text-xl text-blue-400">
            Week {currentWeekIndex + 1}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div 
          key={currentWeekIndex}
          className="animate-fade-in h-full"
        >
          <div className="font-bold text-gray-300 text-4xl mb-3 uppercase">{currentWeekData.weekOf}</div>
          <Table className="border-collapse text-4xl">
            <TableHeader className="bg-gray-700">
              <TableRow>
                <TableHead className="w-24 text-4xl font-bold text-white p-4 border border-gray-600 uppercase">Date</TableHead>
                {currentWeekData.crews.filter(crew => crew.position !== 'OFF').map((crew, crewIndex) => (
                  <TableHead 
                    key={`${crew.position}-${crewIndex}`} 
                    className="text-4xl font-bold text-white p-4 border border-gray-600 text-center min-w-[200px]"
                  >
                    <div className="font-bold text-4xl uppercase">{crew.position}</div>
                    <div className="text-2xl text-gray-300 font-normal uppercase">{crew.name}</div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentWeekData.days.map((day, dayIndex) => (
                <TableRow key={`${day}-${dayIndex}`} className={`${isToday(currentWeekData.dates[dayIndex]) ? 'bg-gray-600' : ''} h-[160px]`}>
                  <TableCell className="p-4 border border-gray-600 font-medium">
                    <div>
                      <div className={`font-bold text-6xl uppercase ${isToday(currentWeekData.dates[dayIndex]) ? 'text-white' : 'text-gray-300'}`}>
                        {day.slice(0, 3)}
                      </div>
                      <div className="text-4xl text-gray-400">
                        {currentWeekData.dates[dayIndex].split('/').slice(0, 2).join('/')}
                      </div>
                    </div>
                  </TableCell>
                  {currentWeekData.crews.filter(crew => crew.position !== 'OFF').map((crew, crewIndex) => (
                    <TableCell 
                      key={`${crewIndex}-${dayIndex}`} 
                      className="p-5 border border-gray-600 text-center"
                    >
                      <div className="space-y-4">
                        {/* Row 1 */}
                        <div className="flex items-center justify-center gap-3 min-h-[48px]">
                          {crew.schedule[dayIndex]?.row1?.color && crew.schedule[dayIndex].row1.color !== 'none' && (
                            <div className={`w-12 h-12 rounded-full ${getColorClass(crew.schedule[dayIndex].row1.color)}`}></div>
                          )}
                          {crew.schedule[dayIndex]?.row1?.jobNumber && (
                            <div className="font-medium text-6xl text-white uppercase">
                              {crew.schedule[dayIndex].row1.jobNumber}
                            </div>
                          )}
                        </div>
                        {crew.schedule[dayIndex]?.row1?.jobName && (
                          <div className="text-gray-300 text-4xl uppercase">
                            {crew.schedule[dayIndex].row1.jobName}
                          </div>
                        )}
                        
                        {/* Row 2 */}
                        <div className="flex items-center justify-center gap-3 min-h-[48px]">
                          {crew.schedule[dayIndex]?.row2?.color && crew.schedule[dayIndex].row2.color !== 'none' && (
                            <div className={`w-12 h-12 rounded-full ${getColorClass(crew.schedule[dayIndex].row2.color)}`}></div>
                          )}
                          {crew.schedule[dayIndex]?.row2?.jobNumber && (
                            <div className="font-medium text-6xl text-white uppercase">
                              {crew.schedule[dayIndex].row2.jobNumber}
                            </div>
                          )}
                        </div>
                        {crew.schedule[dayIndex]?.row2?.jobName && (
                          <div className="text-gray-300 text-4xl uppercase">
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
          
          {/* Progress indicator */}
          <div className="flex justify-center mt-4 space-x-2">
            {data.scheduleData.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                  index === currentWeekIndex ? 'bg-blue-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
