
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
      return <CloudRain className="h-8 w-8 text-truenorth-300" />;
    case 'cloudy':
    case 'partly cloudy':
    default:
      return <CloudSun className="h-8 w-8 text-truenorth-400" />;
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

  if (headerMode) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex gap-4 items-center">
          {weatherData.slice(0, 3).map((day, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 bg-white p-2 rounded-md"
            >
              {index === 0 && <CloudSun className="h-5 w-5 mr-1 text-truenorth-400" />}
              {index === 0 && <span className="font-semibold mr-1">Today:</span>}
              {index !== 0 && <span className="font-semibold mr-1">{day.day}:</span>}
              <div className="flex items-center">
                {getWeatherIcon(day.condition)}
                <div className="flex gap-1 text-sm ml-1">
                  <span className="font-medium">{day.high}°</span>
                  <span className="text-gray-500">{day.low}°</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-truenorth-700">
          <CloudSun className="h-5 w-5" />
          Seattle Weather Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between gap-1">
          {weatherData.map((day, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center bg-white p-2 rounded-md shadow-sm flex-1"
            >
              <div className="font-semibold text-sm mb-1">{day.day}</div>
              <div className="my-1">{getWeatherIcon(day.condition)}</div>
              <div className="flex gap-2 text-sm">
                <span className="font-medium">{day.high}°</span>
                <span className="text-gray-500">{day.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
