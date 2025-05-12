
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
import { WeeklyCalendar } from "@/components/dashboard/WeeklyCalendar";

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
        <div className="max-w-full mx-auto px-6 py-3 flex justify-between items-center">
          <div className="scale-110">
            <TrueNorthLogo />
          </div>
          <div className="flex-grow mx-8">
            <WeatherForecast headerMode={true} />
          </div>
          <div className="scale-110">
            <DashboardClock />
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto px-6 py-4 h-[calc(100vh-9rem)]">
        <div className="grid grid-cols-12 gap-5 h-full">
          {/* Crew Schedule Section */}
          <div className="col-span-9 h-[calc(100vh-11rem)] overflow-hidden">
            <CrewSchedule />
          </div>

          {/* Right Column: Traffic Times and Weekly Calendar */}
          <div className="col-span-3 h-[calc(100vh-11rem)] grid grid-rows-2 gap-5">
            <div className="overflow-auto">
              <TrafficTimes />
            </div>
            <div className="overflow-auto">
              <WeeklyCalendar />
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full fixed bottom-0 bg-gray-800 border-t border-gray-700 py-2 px-6">
        <div className="max-w-full mx-auto flex justify-between items-center">
          <div className="text-base text-gray-300">
            {lastUpdated && (
              <span>Last updated: {formatTime(lastUpdated)}</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={refreshData} title="Refresh Data" className="text-lg text-gray-300 hover:text-white">
              <RefreshCw className="h-6 w-6 mr-2" />
              Refresh
            </Button>
            <ToggleFullscreen />
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="text-lg text-gray-300 hover:text-white">
                <Settings className="mr-2 h-6 w-6" />
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
