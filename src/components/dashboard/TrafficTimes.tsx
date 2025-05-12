
import React from "react";
import { Car, MapPin, Clock, ArrowRightLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Updated routes - both directions
const routesFromSeattle = [
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

const routesToSeattle = [
  {
    from: "Everett",
    to: "Seattle",
    via: "I-5",
    time: "42 min",
    distance: "28 mi",
    status: "Accident at Northgate",
  },
  {
    from: "Tacoma",
    to: "Seattle",
    via: "I-5",
    time: "38 min",
    distance: "34 mi",
    status: "No major delays",
  },
  {
    from: "Puyallup",
    to: "Seattle",
    via: "SR 167",
    time: "50 min",
    distance: "38 mi",
    status: "Construction delays",
  },
];

export const TrafficTimes = () => (
  <Card className="h-full">
    <CardHeader className="pb-1">
      <CardTitle className="flex items-center gap-2 text-truenorth-700 text-2xl">
        <Car className="h-7 w-7" />
        Traffic Times
        <ArrowRightLeft className="h-5 w-5 ml-2 text-truenorth-500" />
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <div className="grid grid-cols-2 w-full mx-auto gap-x-1">
        {/* Left column - To Seattle */}
        <div className="border-r">
          <div className="text-truenorth-600 font-semibold text-lg p-2 bg-gray-100">
            To Seattle
          </div>
          {routesToSeattle.map((route) => (
            <div
              key={`to-${route.from}-${route.to}`}
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
        
        {/* Right column - From Seattle */}
        <div>
          <div className="text-truenorth-600 font-semibold text-lg p-2 bg-gray-100">
            From Seattle
          </div>
          {routesFromSeattle.map((route) => (
            <div
              key={`from-${route.from}-${route.to}`}
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
      </div>
    </CardContent>
  </Card>
);
