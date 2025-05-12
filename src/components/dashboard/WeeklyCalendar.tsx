
import React, { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfWeek, endOfWeek, isToday, addDays } from "date-fns";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";

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
  
  // Get events for the selected week
  const weekEvents = EVENTS.filter(event => 
    event.date >= weekStart && event.date <= weekEnd
  ).sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Get event type badge color
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting": return "bg-blue-100 text-blue-800";
      case "training": return "bg-green-100 text-green-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
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
        <div className="px-4 py-3 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">
              {format(weekStart, "MMMM d")} - {format(weekEnd, "MMMM d, yyyy")}
            </h3>
            <div className="hidden">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border shadow-sm"
              />
            </div>
          </div>
          
          {weekEvents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Date</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead className="w-1/4">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weekEvents.map(event => (
                  <TableRow key={event.id} className={isToday(event.date) ? "bg-blue-50" : ""}>
                    <TableCell className="font-medium">
                      {format(event.date, "EEEE, MMM d")}
                      {isToday(event.date) && <span className="ml-2 text-blue-600 text-xs font-bold">TODAY</span>}
                    </TableCell>
                    <TableCell className="font-medium text-lg">{event.title}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
