
import React from "react";
import { Car, MapPin, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const routes = [
  {
    from: "Seattle",
    to: "Everett",
    time: "35 min",
    distance: "28 mi",
    status: "No major delays",
  },
  {
    from: "Seattle",
    to: "Tacoma",
    time: "40 min",
    distance: "34 mi",
    status: "Heavy traffic near airport",
  },
];

export const TrafficTimes = () => (
  <Card className="bg-white dark:bg-card shadow flex flex-col gap-3">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-truenorth-700">
        <Car className="text-truenorth-500" />
        Traffic Times
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col gap-4">
        {routes.map((route) => (
          <div
            key={route.to}
            className="flex flex-col md:flex-row md:items-center justify-between px-2 py-2 rounded-lg bg-blue-50 dark:bg-truenorth-900/50"
          >
            <div className="flex items-center gap-2">
              <MapPin className="text-truenorth-700" />
              <span className="font-black tracking-wide text-truenorth-700">{route.from}</span>
              <span className="mx-2 text-truenorth-300">→</span>
              <span className="font-black tracking-wide text-truenorth-700">{route.to}</span>
            </div>
            <div className="flex items-center gap-6 mt-2 md:mt-0">
              <div className="flex items-center gap-1">
                <Clock className="text-truenorth-500" />
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

