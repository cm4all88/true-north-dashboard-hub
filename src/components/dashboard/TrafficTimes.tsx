
import React from "react";
import { Car, MapPin, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const routes = [
  {
    from: "Seattle",
    to: "Everett",
    via: "I-5",
    time: "35 min",
    distance: "28 mi",
    status: "No major delays",
  },
  {
    from: "Seattle",
    to: "Tacoma",
    via: "I-5",
    time: "40 min",
    distance: "34 mi",
    status: "Heavy traffic near airport",
  },
  {
    from: "Seattle",
    to: "Puyallup",
    via: "SR 167",
    time: "45 min",
    distance: "38 mi",
    status: "Moderate traffic",
  },
];

export const TrafficTimes = () => (
  <Card className="h-full">
    <CardHeader className="pb-1">
      <CardTitle className="flex items-center gap-2 text-truenorth-700 text-lg">
        <Car className="h-5 w-5" />
        Traffic Times
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <div className="flex flex-col max-w-3xl mx-auto">
        {routes.map((route) => (
          <div
            key={`${route.from}-${route.to}`}
            className="flex flex-row items-center justify-between border-b last:border-b-0 py-2 px-4"
          >
            <div className="flex items-center gap-2">
              <MapPin className="text-truenorth-700 h-4 w-4" />
              <span className="font-semibold text-truenorth-700">{route.from}</span>
              <span className="mx-1 text-gray-400">→</span>
              <span className="font-semibold text-truenorth-700">{route.to}</span>
              <span className="text-xs text-truenorth-500 ml-1">({route.via})</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Clock className="text-truenorth-500 h-4 w-4 mr-1" />
                <span className="font-semibold text-truenorth-600">{route.time}</span>
              </div>
              <div className="text-xs text-truenorth-500">{route.distance}</div>
              <div className="text-xs text-blue-500 italic">{route.status}</div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
