
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useDashboardData } from '@/contexts/DashboardDataContext';

export function ShoutoutBoard() {
  const { data } = useDashboardData();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (data.shoutouts.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.shoutouts.length);
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, [data.shoutouts.length]);

  if (data.shoutouts.length === 0) {
    return (
      <Card className="h-full bg-gray-800">
        <CardHeader className="pb-1 px-3 py-2">
          <CardTitle className="flex items-center gap-2 text-white text-xl">
            <MessageSquare className="h-5 w-5" />
            Team Shoutouts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <p className="text-gray-300 text-lg">No shoutouts available</p>
        </CardContent>
      </Card>
    );
  }

  const currentShoutout = data.shoutouts[currentIndex];

  return (
    <Card className="h-full bg-gray-800 overflow-hidden">
      <CardHeader className="pb-1 px-3 py-1">
        <CardTitle className="flex items-center gap-2 text-white text-xl">
          <MessageSquare className="h-5 w-5" />
          Team Shoutouts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div 
          key={currentIndex}
          className="animate-fade-in"
        >
          <div className="space-y-2">
            <p className="text-white text-2xl leading-relaxed font-medium break-words whitespace-normal">{currentShoutout.text}</p>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-base">From: {currentShoutout.from}</span>
              <span className="text-gray-400 text-base">
                {new Date(currentShoutout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="flex justify-center mt-2 space-x-1">
            {data.shoutouts.map((_, index) => (
              <div
                key={index}
                className={`h-1 w-1 rounded-full transition-colors duration-300 ${
                  index === currentIndex ? 'bg-white' : 'bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
