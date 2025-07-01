
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { shoutoutsMock } from '@/lib/mockData';

export function ShoutoutBoard() {
  const [shoutouts, setShoutouts] = useState(shoutoutsMock);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    // Here you would fetch the real shoutout data
    setShoutouts(shoutoutsMock);
    
    // Auto-refresh every few minutes
    const intervalId = setInterval(() => {
      console.log('Shoutouts would be refreshed here');
    }, 300000); // 5 minutes
    
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (shoutouts.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % shoutouts.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [shoutouts.length]);

  if (shoutouts.length === 0) {
    return (
      <Card className="h-full bg-truenorth-600">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-white">
            <MessageSquare className="h-5 w-5" />
            Team Shoutouts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">No shoutouts available</p>
        </CardContent>
      </Card>
    );
  }

  const currentShoutout = shoutouts[currentIndex];

  return (
    <Card className="h-full bg-truenorth-600 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <MessageSquare className="h-5 w-5" />
          Team Shoutouts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div 
          key={currentIndex}
          className="animate-fade-in"
        >
          <div className="space-y-3">
            <p className="text-white text-lg leading-relaxed">{currentShoutout.text}</p>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">From: {currentShoutout.from}</span>
              <span className="text-gray-400 text-sm">
                {new Date(currentShoutout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="flex justify-center mt-4 space-x-1">
            {shoutouts.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors duration-300 ${
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
