
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
      <CardTitle className="flex items-center gap-2 text-truenorth-700 text-2xl">
        <Car className="h-7 w-7" />
        Traffic Times
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <div className="flex flex-col w-full mx-auto">
        {routes.map((route) => (
          <div
            key={`${route.from}-${route.to}`}
            className="flex flex-col border-b last:border-b-0 py-3 px-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="text-truenorth-700 h-5 w-5 flex-shrink-0" />
              <div className="flex items-center flex-wrap">
                <span className="font-semibold text-truenorth-700 text-xl">{route.from}</span>
                <span className="mx-1 text-gray-400 text-xl">→</span>
                <span className="font-semibold text-truenorth-700 text-xl">{route.to}</span>
                <span className="text-base text-truenorth-500 ml-1">({route.via})</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="text-truenorth-500 h-5 w-5 mr-2" />
                <span className="font-semibold text-truenorth-600 text-xl">{route.time}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-base text-truenorth-500">{route.distance}</div>
                <div className="text-base text-blue-500 italic">{route.status}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
