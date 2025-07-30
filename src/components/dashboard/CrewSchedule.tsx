
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
    // Start with the current week (index 0)
    setCurrentWeekIndex(0);
    
    const interval = setInterval(() => {
      setCurrentWeekIndex((prevIndex) => (prevIndex + 1) % data.scheduleData.length);
    }, 15000); // Change every 15 seconds

    return () => clearInterval(interval);
  }, [data.scheduleData.length]);

  const currentWeekData = data.scheduleData[currentWeekIndex];

  if (!currentWeekData) {
    return (
      <Card className="h-full bg-gray-800">
        <CardContent className="p-2 flex items-center justify-center">
          <div className="text-white text-xl uppercase">No schedule data available</div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full bg-gray-800">
      <CardHeader className="pb-2 px-4 py-2">
        <CardTitle className="flex items-center gap-2 text-white text-xl uppercase">
          <Calendar className="h-5 w-5" />
          Field Crew Schedule
          <ArrowLeftRight className="h-4 w-4 ml-2 text-gray-400" />
          <span className="text-lg text-blue-400">
            Week {currentWeekIndex + 1}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div 
          key={currentWeekIndex}
          className="animate-fade-in h-full"
        >
          <div className="font-bold text-gray-300 text-lg mb-2 uppercase">
            {(() => {
              const firstDate = new Date(currentWeekData.dates[0]);
              const lastDate = new Date(currentWeekData.dates[currentWeekData.dates.length - 1]);
              
              const formatDate = (date: Date) => {
                return date.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric'
                });
              };
              
              const year = firstDate.getFullYear();
              
              return `${formatDate(firstDate)} - ${formatDate(lastDate)}, ${year}`;
            })()}
          </div>
          <Table className="border-collapse">
            <TableHeader className="bg-gray-700">
              <TableRow>
                <TableHead className="w-40 text-base font-bold text-white p-3 border border-gray-600 uppercase">Crew</TableHead>
                {currentWeekData.days.map((day, dayIndex) => (
                  <TableHead 
                    key={`${day}-${dayIndex}`} 
                    className={`text-base font-bold text-white p-3 border border-gray-600 text-center min-w-[140px] ${
                      isToday(currentWeekData.dates[dayIndex]) ? 'bg-gray-600' : ''
                    }`}
                  >
                    <div className="font-bold text-base uppercase">
                      {day.slice(0, 3)}
                    </div>
                    <div className="text-sm text-gray-300 font-normal">
                      {currentWeekData.dates[dayIndex].split('/').slice(0, 2).join('/')}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentWeekData.crews.filter(crew => crew.position !== 'OFF').map((crew, crewIndex) => (
                <TableRow key={`${crew.position}-${crewIndex}`} className="h-[135px]">
                  <TableCell className="p-3 border border-gray-600 font-medium">
                    <div>
                      <div className="font-bold text-lg uppercase text-white">
                        {crew.position}
                      </div>
                      <div className="text-base text-gray-300 uppercase">
                        {crew.name}
                      </div>
                    </div>
                  </TableCell>
                  {currentWeekData.days.map((_, dayIndex) => (
                    <TableCell 
                      key={`${crewIndex}-${dayIndex}`} 
                      className={`p-2 border border-gray-600 text-center ${
                        isToday(currentWeekData.dates[dayIndex]) ? 'bg-gray-600' : ''
                      }`}
                    >
                      <div className="space-y-1">
                        {/* Row 1 */}
                        <div className="flex items-center justify-center gap-2 min-h-[24px]">
                          {crew.schedule[dayIndex]?.row1?.color && crew.schedule[dayIndex].row1.color !== 'none' && (
                            <div className={`w-4 h-4 rounded-full ${getColorClass(crew.schedule[dayIndex].row1.color)}`}></div>
                          )}
                          {crew.schedule[dayIndex]?.row1?.jobNumber && (
                            <div className="font-medium text-lg text-white uppercase">
                              {crew.schedule[dayIndex].row1.jobNumber}
                            </div>
                          )}
                        </div>
                        {crew.schedule[dayIndex]?.row1?.jobName && (
                          <div className="text-gray-300 text-base uppercase">
                            {crew.schedule[dayIndex].row1.jobName}
                          </div>
                        )}
                        
                        {/* Row 2 */}
                        <div className="flex items-center justify-center gap-2 min-h-[24px]">
                          {crew.schedule[dayIndex]?.row2?.color && crew.schedule[dayIndex].row2.color !== 'none' && (
                            <div className={`w-4 h-4 rounded-full ${getColorClass(crew.schedule[dayIndex].row2.color)}`}></div>
                          )}
                          {crew.schedule[dayIndex]?.row2?.jobNumber && (
                            <div className="font-medium text-lg text-white uppercase">
                              {crew.schedule[dayIndex].row2.jobNumber}
                            </div>
                          )}
                        </div>
                        {crew.schedule[dayIndex]?.row2?.jobName && (
                          <div className="text-gray-300 text-base uppercase">
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
          <div className="flex justify-center mt-2 space-x-1">
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
