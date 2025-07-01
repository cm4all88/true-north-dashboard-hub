
import React from 'react';
import { Link } from 'react-router-dom';
import { TrueNorthLogo } from '@/components/TrueNorthLogo';
import { CrewSchedule } from '@/components/dashboard/CrewSchedule';
import { WeatherForecast } from '@/components/dashboard/WeatherForecast';
import { DashboardClock } from '@/components/dashboard/DashboardClock';
import { useAutoRefresh } from '@/components/dashboard/AutoRefreshProvider';
import { Button } from '@/components/ui/button';
import { Settings, RefreshCw } from "lucide-react";
import { ToggleFullscreen } from '@/components/ToggleFullscreen';
import { TrafficTimes } from "@/components/dashboard/TrafficTimes";
import { TimeOffCalendar } from "@/components/dashboard/TimeOffCalendar";
import { ComicOfTheDay } from "@/components/dashboard/ComicOfTheDay";

const Index = () => {
  const { lastUpdated, refreshData } = useAutoRefresh();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white dashboard-fullscreen" id="dashboard-container">
      <header className="w-full bg-gray-800 shadow-md">
        <div className="max-w-full mx-auto px-6 py-4 flex justify-between items-center">
          <TrueNorthLogo />
          <div className="flex-grow mx-8">
            <WeatherForecast headerMode={true} />
          </div>
          <div className="scale-125">
            <DashboardClock />
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto px-6 py-6 h-[calc(100vh-12rem)]">
        {/* Vertical layout optimized for portrait 55" monitor */}
        <div className="flex flex-col gap-6 h-full">
          {/* Top section: Crew Schedule - takes up 45% of available height */}
          <div className="h-[45%]">
            <CrewSchedule />
          </div>

          {/* Middle section: Traffic Times - takes up 30% of available height */}
          <div className="h-[30%]">
            <TrafficTimes />
          </div>
          
          {/* Bottom section: Time Off Calendar and Comic side by side - takes up 25% */}
          <div className="h-[25%] grid grid-cols-2 gap-6">
            <div className="overflow-auto">
              <TimeOffCalendar />
            </div>
            <div className="overflow-auto">
              <ComicOfTheDay />
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full fixed bottom-0 bg-gray-800 border-t border-gray-700 py-3 px-6">
        <div className="max-w-full mx-auto flex justify-between items-center">
          <div className="text-lg text-gray-300">
            {lastUpdated && (
              <span>Last updated: {formatTime(lastUpdated)}</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="lg" onClick={refreshData} title="Refresh Data" className="text-xl text-gray-300 hover:text-white">
              <RefreshCw className="h-7 w-7 mr-2" />
              Refresh
            </Button>
            <ToggleFullscreen />
            <Link to="/admin">
              <Button variant="ghost" size="lg" className="text-xl text-gray-300 hover:text-white">
                <Settings className="mr-2 h-7 w-7" />
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
