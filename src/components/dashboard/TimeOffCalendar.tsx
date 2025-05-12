
import React from "react";
import { CalendarCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, addDays, isBefore, addMonths } from "date-fns";

export const TimeOffCalendar = () => {
  const today = new Date();
  
  // Sample events - replace with actual data
  const events = [
    { date: addDays(today, 3), type: 'timeoff', name: 'John - Vacation' },
    { date: addDays(today, 5), type: 'birthday', name: 'Mike\'s Birthday' },
    { date: addDays(today, 8), type: 'timeoff', name: 'Sarah - Personal Day' },
    { date: addDays(today, 12), type: 'birthday', name: 'Lisa\'s Birthday' },
    { date: addDays(today, 15), type: 'timeoff', name: 'Alex - Medical Leave' },
  ];
  
  // Only show upcoming events for the next month
  const upcomingEvents = events
    .filter(event => isBefore(event.date, addMonths(today, 1)))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
    
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-truenorth-700">
          <CalendarCheck className="h-5 w-5" />
          Upcoming Time Off & Birthdays
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingEvents.map((event, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-md bg-blue-50 dark:bg-truenorth-900/50"
            >
              <div className="flex flex-col">
                <span className="font-medium">{event.name}</span>
                <span className="text-sm text-gray-600">{format(event.date, "EEEE, MMMM d")}</span>
              </div>
              <Badge className={event.type === 'birthday' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : 'bg-blue-100 text-blue-800 hover:bg-blue-100'}>
                {event.type === 'birthday' ? 'Birthday' : 'Time Off'}
              </Badge>
            </div>
          ))}
          {upcomingEvents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No upcoming events scheduled
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
