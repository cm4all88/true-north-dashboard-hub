
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
      <header className="w-full bg-gray-800 shadow-md h-16">
        <div className="max-w-full mx-auto px-4 py-2 flex justify-between items-center h-full">
          <div className="flex-shrink-0">
            <TrueNorthLogo />
          </div>
        </div>
      </header>

      <main className="px-4 py-3" style={{ height: 'calc(100vh - 112px)' }}>
        <div className="flex flex-col gap-3 h-full">
          {/* Top section: Weather and Clock */}
          <div className="h-[15%] flex gap-3">
            <div className="flex-1">
              <WeatherForecast headerMode={false} />
            </div>
            <div className="flex-shrink-0 flex items-center justify-center bg-gray-800 rounded-lg px-6">
              <DashboardClock />
            </div>
          </div>

          {/* Middle section: Crew Schedule - 55% */}
          <div className="h-[55%] min-h-0">
            <CrewSchedule />
          </div>

          {/* Bottom section: Traffic Times - 30% */}
          <div className="h-[30%] min-h-0">
            <TrafficTimes />
          </div>
        </div>
      </main>

      <footer className="w-full fixed bottom-0 bg-gray-800 border-t border-gray-700 py-2 px-4 h-12">
        <div className="max-w-full mx-auto flex justify-between items-center h-full">
          <div className="text-sm text-gray-300">
            {lastUpdated && (
              <span>Last updated: {formatTime(lastUpdated)}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={refreshData} title="Refresh Data" className="text-sm text-gray-300 hover:text-white">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <ToggleFullscreen />
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="text-sm text-gray-300 hover:text-white">
                <Settings className="mr-1 h-4 w-4" />
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
