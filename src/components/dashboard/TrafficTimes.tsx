
import React, { useState, useEffect } from "react";
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

// Combine all routes for scrolling
const allRoutes = [...routesToSeattle, ...routesFromSeattle];

export const TrafficTimes = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % allRoutes.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const currentRoute = allRoutes[currentIndex];

  return (
    <Card className="h-full bg-gray-800 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white text-xl">
          <Car className="h-6 w-6" />
          Traffic Times
          <ArrowRightLeft className="h-4 w-4 ml-2 text-gray-400" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div 
          key={currentIndex}
          className="animate-fade-in"
        >
          <div className="flex flex-col space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="text-white h-6 w-6 flex-shrink-0" />
              <div className="flex items-center flex-wrap">
                <span className="font-bold text-white text-2xl">{currentRoute.from}</span>
                <span className="mx-2 text-gray-400 text-2xl">→</span>
                <span className="font-bold text-white text-2xl">{currentRoute.to}</span>
                <span className="text-lg text-gray-300 ml-2">({currentRoute.via})</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="text-gray-300 h-6 w-6 mr-3" />
                <span className="font-bold text-green-400 text-3xl">{currentRoute.time}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-lg text-gray-300">{currentRoute.distance}</div>
                <div className="text-lg text-blue-400 italic font-medium">{currentRoute.status}</div>
              </div>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="flex justify-center mt-4 space-x-1">
            {allRoutes.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                  index === currentIndex ? 'bg-blue-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
