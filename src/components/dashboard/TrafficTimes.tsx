
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
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center gap-2 text-truenorth-700">
        <Car className="h-5 w-5" />
        Traffic Times
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4 overflow-auto">
      <div className="flex flex-col gap-2">
        {routes.map((route) => (
          <div
            key={`${route.from}-${route.to}`}
            className="flex flex-col md:flex-row md:items-center justify-between px-2 py-1 rounded-lg bg-blue-50 dark:bg-truenorth-900/50"
          >
            <div className="flex items-center gap-2">
              <MapPin className="text-truenorth-700 h-4 w-4" />
              <span className="font-black tracking-wide text-truenorth-700">{route.from}</span>
              <span className="mx-2 text-truenorth-300">→</span>
              <span className="font-black tracking-wide text-truenorth-700">{route.to}</span>
              <span className="text-xs text-truenorth-500">({route.via})</span>
            </div>
            <div className="flex items-center gap-6 mt-1 md:mt-0">
              <div className="flex items-center gap-1">
                <Clock className="text-truenorth-500 h-4 w-4" />
                <span className="font-black text-truenorth-600">{route.time}</span>
              </div>
              <div className="text-xs text-truenorth-500">{route.distance}</div>
              <div className="text-xs text-truenorth-400 italic">{route.status}</div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
