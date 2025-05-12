
import React from "react";
import { CalendarDays } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format, startOfWeek, endOfWeek, isToday, addDays, isSameDay } from "date-fns";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock events data - replace with actual API call in production
const EVENTS = [
  { id: 1, title: "Team Meeting", date: addDays(new Date(), 1), type: "meeting" },
  { id: 2, title: "Safety Training", date: addDays(new Date(), 2), type: "training" },
  { id: 3, title: "Equipment Inspection", date: addDays(new Date(), 3), type: "maintenance" },
  { id: 4, title: "Flight Schedule Review", date: addDays(new Date(), 0), type: "meeting" },
  { id: 5, title: "Pilot Certification", date: addDays(new Date(), 4), type: "training" }
];

export const WeeklyCalendar = () => {
  const today = new Date();
  
  // Calculate work week range (Monday to Friday)
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const weekEnd = addDays(weekStart, 4); // Friday (4 days after Monday)
  
  // Filter events to only include work week (Monday to Friday)
  const workWeekEvents = EVENTS.filter(event => {
    const day = event.date.getDay();
    // Include only events from Monday (1) to Friday (5)
    return day >= 1 && day <= 5 && 
           event.date >= weekStart && 
           event.date <= weekEnd;
  }).sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Get event type badge
  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case "meeting": 
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Meeting</Badge>;
      case "training": 
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Training</Badge>;
      case "maintenance": 
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Maintenance</Badge>;
      default: 
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{type}</Badge>;
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-truenorth-700 text-xl">
          <CalendarDays className="h-6 w-6" />
          This Week's Events
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-4 py-3 flex flex-col h-full">
          <div className="mb-2">
            <h3 className="font-bold text-base">
              {format(weekStart, "MMMM d")} - {format(weekEnd, "MMMM d, yyyy")}
            </h3>
          </div>
          
          {workWeekEvents.length > 0 ? (
            <div className="space-y-2">
              {workWeekEvents.map(event => (
                <div 
                  key={event.id} 
                  className={`p-2 rounded-md ${isToday(event.date) ? "bg-blue-50 border-l-4 border-blue-400" : "bg-white border border-gray-100"}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium">
                      {format(event.date, "EEEE, MMM d")}
                      {isToday(event.date) && <span className="ml-2 text-blue-600 text-xs font-bold">TODAY</span>}
                    </div>
                    {getEventTypeBadge(event.type)}
                  </div>
                  <div className="text-lg font-semibold mt-1">{event.title}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xl text-center py-10 text-gray-500">
              No events scheduled for this week
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
