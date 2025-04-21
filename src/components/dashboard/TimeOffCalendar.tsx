
import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

export const TimeOffCalendar = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
  // Sample events - replace with actual data
  const events = [
    { date: new Date(2025, 3, 25), type: 'timeoff', name: 'John - Vacation' },
    { date: new Date(2025, 3, 21), type: 'birthday', name: 'Mike\'s Birthday' },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-truenorth-700">
          <CalendarIcon className="h-5 w-5" />
          Time Off & Birthdays
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border w-full"
        />
        <div className="mt-4 space-y-2">
          {events.map((event, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm p-2 rounded-md bg-blue-50 dark:bg-truenorth-900/50"
            >
              <div className={`w-2 h-2 rounded-full ${
                event.type === 'birthday' ? 'bg-yellow-400' : 'bg-blue-400'
              }`} />
              <span>{event.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
