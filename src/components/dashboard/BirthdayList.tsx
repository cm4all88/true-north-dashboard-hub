
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { birthdaysMock } from '@/lib/mockData';

export function BirthdayList() {
  const [birthdays, setBirthdays] = useState(birthdaysMock);
  const [currentMonth, setCurrentMonth] = useState('');
  
  useEffect(() => {
    // Set the current month
    const now = new Date();
    setCurrentMonth(now.toLocaleDateString('en-US', { month: 'long' }));
    
    // Here you would fetch the real birthday data
    // For example:
    // const fetchBirthdays = async () => {
    //   try {
    //     const response = await fetch('/api/birthdays');
    //     const data = await response.json();
    //     setBirthdays(data);
    //   } catch (error) {
    //     console.error('Error fetching birthdays:', error);
    //   }
    // };
    // fetchBirthdays();
  }, []);

  // Filter birthdays to show only upcoming ones for current and next month
  const upcomingBirthdays = birthdays.filter((birthday) => {
    // This would normally use the actual date logic to filter
    // For the mock, we're showing all of them
    return true;
  });

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-truenorth-700">
          <CalendarIcon className="h-5 w-5" />
          Upcoming Birthdays
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingBirthdays.length > 0 ? (
          <div className="space-y-3">
            {upcomingBirthdays.map((birthday, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm"
              >
                <div className="font-medium">{birthday.name}</div>
                <div className="text-sm text-gray-500">{birthday.formatted}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-32 text-gray-500">
            No upcoming birthdays
          </div>
        )}
      </CardContent>
    </Card>
  );
}
