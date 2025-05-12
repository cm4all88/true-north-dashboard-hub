
import React, { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, addDays } from "date-fns";

// Mock events data - replace with actual API call in production
const EVENTS = [
  { id: 1, title: "Team Meeting", date: addDays(new Date(), 1), type: "meeting" },
  { id: 2, title: "Safety Training", date: addDays(new Date(), 2), type: "training" },
  { id: 3, title: "Equipment Inspection", date: addDays(new Date(), 3), type: "maintenance" },
  { id: 4, title: "Flight Schedule Review", date: addDays(new Date(), 0), type: "meeting" },
  { id: 5, title: "Pilot Certification", date: addDays(new Date(), 4), type: "training" }
];

export const WeeklyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Calculate current week range
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 }); // Sunday
  
  // Get all days of the current week
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Filter events for the selected week
  const weekEvents = EVENTS.filter(event => 
    event.date >= weekStart && event.date <= weekEnd
  );

  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    return weekEvents.filter(event => 
      date.getDate() === event.date.getDate() && 
      date.getMonth() === event.date.getMonth() && 
      date.getFullYear() === event.date.getFullYear()
    );
  };

  // Get background color based on event type
  const getEventColor = (type: string) => {
    switch (type) {
      case "meeting": return "bg-blue-100 border-blue-300";
      case "training": return "bg-green-100 border-green-300";
      case "maintenance": return "bg-yellow-100 border-yellow-300";
      default: return "bg-gray-100 border-gray-300";
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-truenorth-700 text-2xl">
          <CalendarIcon className="h-7 w-7" />
          This Week's Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="px-4 pt-2 pb-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="w-full rounded-md border shadow-sm"
            />
          </div>
          <div className="px-4 py-3">
            <h3 className="font-bold text-lg mb-2">
              {format(weekStart, "MMMM d")} - {format(weekEnd, "MMMM d, yyyy")}
            </h3>
            <div className="space-y-2">
              {weekEvents.length > 0 ? (
                weekEvents.map(event => (
                  <div 
                    key={event.id}
                    className={`p-3 rounded-md border-l-4 ${getEventColor(event.type)}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-lg">{event.title}</span>
                      <span className="text-truenorth-500">
                        {format(event.date, "EEEE, MMM d")}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-lg text-center py-6 text-gray-500">
                  No events scheduled for this week
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
