
import React from 'react';
import { Link } from 'react-router-dom';
import { TrueNorthLogo } from '@/components/TrueNorthLogo';
import { CrewSchedule } from '@/components/dashboard/CrewSchedule';
import { WeatherForecast } from '@/components/dashboard/WeatherForecast';
import { DashboardClock } from '@/components/dashboard/DashboardClock';
import { ShoutoutBoard } from '@/components/dashboard/ShoutoutBoard';
import { useAutoRefresh } from '@/components/dashboard/AutoRefreshProvider';
import { Button } from '@/components/ui/button';
import { Settings, RefreshCw } from "lucide-react";
import { ToggleFullscreen } from '@/components/ToggleFullscreen';
import { TrafficTimes } from "@/components/dashboard/TrafficTimes";

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
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden" id="dashboard-container">
      {/* Container with 16:9 aspect ratio */}
      <div className="w-full h-screen flex flex-col">
        <header className="w-full bg-gray-800 shadow-md h-10 flex-shrink-0">
          <div className="max-w-full mx-auto px-3 py-1 flex justify-between items-center h-full">
            <div className="flex-shrink-0">
              <TrueNorthLogo />
            </div>
          </div>
        </header>

        <main className="flex-1 px-2 py-1 min-h-0">
          <div className="flex flex-col gap-1 h-full">
            {/* Top section: Weather and Clock - Doubled from 6% to 12% */}
            <div className="h-[12%] flex gap-2">
              <div className="flex-1">
                <WeatherForecast headerMode={false} />
              </div>
              <div className="flex-shrink-0 flex items-center justify-center bg-gray-800 rounded-lg px-2">
                <DashboardClock />
              </div>
            </div>

            {/* Middle section: Crew Schedule - Reduced from 82% to 64% to accommodate other increases */}
            <div className="h-[64%] min-h-0">
              <CrewSchedule />
            </div>

            {/* Shoutouts section - Doubled from 6% to 12% */}
            <div className="h-[12%] min-h-0">
              <ShoutoutBoard />
            </div>

            {/* Bottom section: Traffic Times - Doubled from 6% to 12% */}
            <div className="h-[12%] min-h-0">
              <TrafficTimes />
            </div>
          </div>
        </main>

        <footer className="w-full bg-gray-800 border-t border-gray-700 py-1 px-3 h-6 flex-shrink-0">
          <div className="max-w-full mx-auto flex justify-between items-center h-full">
            <div className="text-xs text-gray-300">
              {lastUpdated && (
                <span>Last updated: {formatTime(lastUpdated)}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={refreshData} title="Refresh Data" className="text-xs text-gray-300 hover:text-white h-4 px-1">
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
              <ToggleFullscreen />
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="text-xs text-gray-300 hover:text-white h-4 px-1">
                  <Settings className="mr-1 h-3 w-3" />
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
