
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

// Function to get color based on project manager
const getProjectManagerColor = (projectManager: string, colorOverrides: Record<string, string> = {}) => {
  if (!projectManager || projectManager.trim() === '') return '';
  
  // Check if there's a color override
  if (colorOverrides[projectManager]) {
    return colorOverrides[projectManager];
  }
  
  // Simple hash function to assign consistent colors
  const hash = projectManager.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const colors = [
    'bg-orange-500',
    'bg-blue-500', 
    'bg-green-500',
    'bg-purple-500'
  ];
  
  return colors[Math.abs(hash) % colors.length];
};

export function CrewSchedule() {
  const { data } = useDashboardData();
  
  // For now, we'll use empty color overrides in the dashboard view
  // In the future, this could be stored in the context or passed as props
  const colorOverrides: Record<string, string> = {};
  
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
                    {weekData.crews.map((crew, crewIndex) => (
                      <TableHead 
                        key={`${crew.position}-${crewIndex}`} 
                        className={`text-sm font-bold text-white p-2 border border-gray-600 text-center ${
                          crew.position === 'OFF' ? 'min-w-[50px]' : 'min-w-[150px]'
                        }`}
                      >
                        <div className="font-bold text-sm">{crew.position}</div>
                        <div className="text-xs text-gray-300 font-normal">{crew.name}</div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weekData.days.map((day, dayIndex) => (
                    <TableRow key={`${day}-${dayIndex}`} className={`${isToday(weekData.dates[dayIndex]) ? 'bg-gray-600' : ''} h-[60px]`}>
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
                      {weekData.crews.map((crew, crewIndex) => (
                        <TableCell 
                          key={`${crewIndex}-${dayIndex}`} 
                          className="p-2 border border-gray-600 text-center"
                        >
                          {crew.schedule[dayIndex]?.projects && crew.schedule[dayIndex].projects.length > 0 ? (
                            <div className="space-y-1">
                              {crew.schedule[dayIndex].projects.map((project, projectIndex) => (
                                <div key={projectIndex} className="space-y-1">
                                  <div className="flex items-center justify-center gap-2">
                                    {project.projectManager && (
                                      <div className={`w-3 h-3 rounded-full ${getProjectManagerColor(project.projectManager, colorOverrides)}`}></div>
                                    )}
                                    <div className="font-medium text-sm text-white">
                                      {project.jobCode}
                                    </div>
                                  </div>
                                  {project.description && (
                                    <div className="text-gray-300 text-xs">
                                      {project.description}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : crew.schedule[dayIndex]?.jobCode && crew.schedule[dayIndex].jobCode.trim() !== '' && crew.schedule[dayIndex].jobCode !== 'OFF' ? (
                            <div className="space-y-1">
                              <div className="flex items-center justify-center gap-2">
                                {crew.schedule[dayIndex].projectManager && (
                                  <div className={`w-3 h-3 rounded-full ${getProjectManagerColor(crew.schedule[dayIndex].projectManager, colorOverrides)}`}></div>
                                )}
                                <div className="font-medium text-sm text-white">
                                  {crew.schedule[dayIndex].jobCode}
                                </div>
                              </div>
                              {crew.schedule[dayIndex].description && (
                                <div className="text-gray-300 text-xs">
                                  {crew.schedule[dayIndex].description}
                                </div>
                              )}
                            </div>
                          ) : crew.schedule[dayIndex]?.jobCode === 'OFF' ? (
                            <div className="text-gray-400 text-sm font-medium">
                              OFF
                            </div>
                          ) : null}
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
