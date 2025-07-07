
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { getBirthdays, type BirthdayData } from '@/services/supabaseService';

export function BirthdayList() {
  const [birthdays, setBirthdays] = useState<BirthdayData[]>([]);
  const [currentMonth, setCurrentMonth] = useState('');
  
  useEffect(() => {
    // Set the current month
    const now = new Date();
    setCurrentMonth(now.toLocaleDateString('en-US', { month: 'long' }));
    
    // Fetch real birthday data from Supabase
    const fetchBirthdays = async () => {
      try {
        const data = await getBirthdays();
        setBirthdays(data);
      } catch (error) {
        console.error('Error fetching birthdays:', error);
      }
    };
    fetchBirthdays();
  }, []);

  // Filter birthdays to show only upcoming ones for current and next month
  const upcomingBirthdays = birthdays.filter((birthday) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const birthdayMonth = birthday.date.getMonth();
    return birthdayMonth === currentMonth || birthdayMonth === nextMonth;
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
                <div className="text-sm text-gray-500">
                  {birthday.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
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
