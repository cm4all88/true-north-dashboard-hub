
import React, { useState, useEffect } from "react";
import { Car, MapPin, Clock, ArrowRightLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getTrafficData, TrafficRoute } from "@/services/trafficService";

export const TrafficTimes = () => {
  const [routes, setRoutes] = useState<TrafficRoute[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch traffic data on component mount
  useEffect(() => {
    const fetchTraffic = async () => {
      setLoading(true);
      try {
        const trafficData = await getTrafficData();
        setRoutes(trafficData);
      } catch (error) {
        console.error('Error fetching traffic data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTraffic();
  }, []);

  // Auto-rotate through routes
  useEffect(() => {
    if (routes.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % routes.length);
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, [routes.length]);

  const currentRoute = routes[currentIndex];

  if (loading) {
    return (
      <Card className="h-full bg-gray-800 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-white text-xl">
            <Car className="h-6 w-6" />
            Traffic Times
            <ArrowRightLeft className="h-4 w-4 ml-2 text-gray-400" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex items-center justify-center">
          <div className="text-gray-300">Loading traffic data...</div>
        </CardContent>
      </Card>
    );
  }

  if (!currentRoute) {
    return (
      <Card className="h-full bg-gray-800 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-white text-xl">
            <Car className="h-6 w-6" />
            Traffic Times
            <ArrowRightLeft className="h-4 w-4 ml-2 text-gray-400" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex items-center justify-center">
          <div className="text-gray-300">No traffic data available</div>
        </CardContent>
      </Card>
    );
  }

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
            {routes.map((_, index) => (
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
