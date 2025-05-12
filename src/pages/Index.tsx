
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
    <div className="min-h-screen bg-gray-50 text-gray-900 dashboard-fullscreen" id="dashboard-container">
      <header className="w-full bg-white shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-6 py-3 flex justify-between items-center">
          <TrueNorthLogo />
          <div className="flex-grow mx-6">
            <WeatherForecast headerMode={true} />
          </div>
          <DashboardClock />
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-6 py-4 h-[calc(100vh-10rem)]">
        <div className="grid grid-cols-1 gap-4 h-full">
          {/* Crew Schedule Section - Optimized for 55" TV */}
          <div className="h-[70vh] overflow-hidden">
            <CrewSchedule />
          </div>

          {/* Traffic Section - Optimized for 55" TV */}
          <div className="h-[20vh]">
            <div className="max-w-5xl mx-auto">
              <TrafficTimes />
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full fixed bottom-0 bg-white border-t py-2 px-6">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {lastUpdated && (
              <span>Last updated: {formatTime(lastUpdated)}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={refreshData} title="Refresh Data">
              <RefreshCw className="h-5 w-5" />
            </Button>
            <ToggleFullscreen />
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                <Settings className="mr-2 h-5 w-5" />
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
