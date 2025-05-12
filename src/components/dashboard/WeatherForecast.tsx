
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun, CloudRain, Sun } from "lucide-react";
import { weatherForecastMock } from '@/lib/mockData';

// Function to determine which weather icon to display
const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case 'sunny':
      return <Sun className="h-8 w-8 text-yellow-400" />;
    case 'rainy':
      return <CloudRain className="h-8 w-8 text-blue-300" />;
    case 'cloudy':
    case 'partly cloudy':
    default:
      return <CloudSun className="h-8 w-8 text-gray-300" />;
  }
};

interface WeatherForecastProps {
  headerMode?: boolean;
}

export function WeatherForecast({ headerMode = false }: WeatherForecastProps) {
  const [weatherData, setWeatherData] = useState(weatherForecastMock);
  
  useEffect(() => {
    // Here you would fetch real weather data from an API
    // For now, we'll use our mock data
    const intervalId = setInterval(() => {
      // Simulate data refresh every hour
      console.log('Weather data would be refreshed here');
    }, 3600000); // 1 hour
    
    return () => clearInterval(intervalId);
  }, []);

  // Only show first 5 days
  const visibleWeatherData = weatherData.slice(0, 5);

  if (headerMode) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex gap-4 items-center">
          {visibleWeatherData.map((day, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 bg-gray-700 p-2 rounded-md"
            >
              {index === 0 && <CloudSun className="h-5 w-5 mr-1 text-gray-300" />}
              {index === 0 && <span className="font-semibold mr-1 text-white">Today:</span>}
              {index !== 0 && <span className="font-semibold mr-1 text-white">{day.day}:</span>}
              <div className="flex items-center">
                {getWeatherIcon(day.condition)}
                <div className="flex gap-1 text-sm ml-1">
                  <span className="font-medium text-white">{day.high}°</span>
                  <span className="text-gray-300">{day.low}°</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className="h-full bg-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white">
          <CloudSun className="h-5 w-5" />
          Seattle Weather Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between gap-1">
          {visibleWeatherData.map((day, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center bg-gray-700 p-2 rounded-md shadow-sm flex-1"
            >
              <div className="font-semibold text-sm mb-1 text-white">{day.day}</div>
              <div className="my-1">{getWeatherIcon(day.condition)}</div>
              <div className="flex gap-2 text-sm">
                <span className="font-medium text-white">{day.high}°</span>
                <span className="text-gray-300">{day.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
