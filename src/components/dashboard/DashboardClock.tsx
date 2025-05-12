
import React, { useState, useEffect } from 'react';

export function DashboardClock() {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000); // Update every second for smooth clock display
    
    return () => clearInterval(intervalId);
  }, []);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="flex flex-col items-end">
      <div className="text-3xl font-semibold text-white">
        {formatTime(time)}
      </div>
      <div className="text-lg text-white">
        {formatDate(time)}
      </div>
    </div>
  );
}
