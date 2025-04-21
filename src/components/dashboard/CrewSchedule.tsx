
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { crewScheduleMock, getCurrentWeekRange, isToday } from '@/lib/mockData';

type WeekdayType = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
type ScheduleType = Record<WeekdayType, string[]>;

// Keep reference to the type of mock data
const mockCrewSchedule = crewScheduleMock;

export function CrewSchedule() {
  const [schedule, setSchedule] = useState<ScheduleType>(mockCrewSchedule);
  const [currentWeek, setCurrentWeek] = useState<string>('');
  
  // Helper function to format the current week range
  const formatWeekRange = () => {
    const today = new Date();
    const day = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Find the date of the Monday of this week
    const mondayDate = new Date(today);
    mondayDate.setDate(today.getDate() - day + (day === 0 ? -6 : 1));
    
    // Find the date of the Friday of this week
    const fridayDate = new Date(mondayDate);
    fridayDate.setDate(mondayDate.getDate() + 4);
    
    // Format the dates
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    return `${formatDate(mondayDate)} - ${formatDate(fridayDate)}`;
  };

  useEffect(() => {
    // Set the current week range
    setCurrentWeek(getCurrentWeekRange());
    
    // Here you would fetch the real crew schedule from a database or API
    // For example:
    // const fetchCrewSchedule = async () => {
    //   try {
    //     const response = await fetch('/api/crew-schedule');
    //     const data = await response.json();
    //     setSchedule(data);
    //   } catch (error) {
    //     console.error('Error fetching crew schedule:', error);
    //   }
    // };
    // fetchCrewSchedule();
  }, []);

  // isToday is imported from mockData

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-truenorth-700">
          <Calendar className="h-5 w-5" />
          Field Crew Schedule
        </CardTitle>
        <CardDescription>{currentWeek}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(schedule).map(([day, crew]) => (
            <div 
              key={day} 
              className={`flex flex-col p-3 rounded-md ${isToday(day) 
                ? 'bg-truenorth-100 border border-truenorth-300' 
                : 'bg-white shadow-sm'
              }`}
            >
              <div className={`font-semibold ${isToday(day) ? 'text-truenorth-700' : 'text-gray-700'} mb-2`}>
                {day}
              </div>
              <div className="space-y-1">
                {crew.map((member, index) => (
                  <div key={index} className="text-sm py-1 px-2 bg-gray-50 rounded">
                    {member}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
