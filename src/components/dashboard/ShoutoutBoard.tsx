
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { shoutoutsMock } from '@/lib/mockData';

export function ShoutoutBoard() {
  const [shoutouts, setShoutouts] = useState(shoutoutsMock);
  
  useEffect(() => {
    // Here you would fetch the real shoutout data
    // For example:
    // const fetchShoutouts = async () => {
    //   try {
    //     const response = await fetch('/api/shoutouts');
    //     const data = await response.json();
    //     setShoutouts(data);
    //   } catch (error) {
    //     console.error('Error fetching shoutouts:', error);
    //   }
    // };
    // fetchShoutouts();
    
    // Auto-refresh every few minutes
    const intervalId = setInterval(() => {
      // Refresh shoutouts
      console.log('Shoutouts would be refreshed here');
    }, 300000); // 5 minutes
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-truenorth-700">
          <MessageSquare className="h-5 w-5" />
          Team Shoutouts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {shoutouts.map((shoutout) => (
            <div 
              key={shoutout.id} 
              className="bg-white p-4 rounded-md shadow-sm border-l-4 border-truenorth-500 animate-fade-in"
            >
              <p className="text-gray-800 mb-2">{shoutout.text}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>From: {shoutout.from}</span>
                <span>{new Date(shoutout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
