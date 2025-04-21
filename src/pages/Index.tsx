
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrueNorthLogo } from '@/components/TrueNorthLogo';
import { CrewSchedule } from '@/components/dashboard/CrewSchedule';
import { WeatherForecast } from '@/components/dashboard/WeatherForecast';
import { BirthdayList } from '@/components/dashboard/BirthdayList';
import { ShoutoutBoard } from '@/components/dashboard/ShoutoutBoard';
import { DashboardClock } from '@/components/dashboard/DashboardClock';
import { useAutoRefresh } from '@/components/dashboard/AutoRefreshProvider';
import { Button } from '@/components/ui/button';
import { Settings, RefreshCw } from "lucide-react";
import { ToggleFullscreen } from '@/components/ToggleFullscreen';

const Index = () => {
  const { lastUpdated, refreshData } = useAutoRefresh();

  // Format time for last updated display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900" id="dashboard-container">
      <header className="w-full bg-white shadow-sm">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex justify-between items-center">
          <TrueNorthLogo />
          <DashboardClock />
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Crew Schedule - Spans 5 columns */}
          <div className="col-span-12 lg:col-span-5 xl:col-span-5">
            <CrewSchedule />
          </div>

          {/* Weather Forecast - Spans 7 columns */}
          <div className="col-span-12 lg:col-span-7 xl:col-span-7">
            <WeatherForecast />
          </div>

          {/* Birthdays - Spans 4 columns */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <BirthdayList />
          </div>

          {/* Shoutouts - Spans 8 columns */}
          <div className="col-span-12 md:col-span-6 lg:col-span-8">
            <ShoutoutBoard />
          </div>
        </div>
      </main>

      <footer className="w-full fixed bottom-0 bg-white border-t py-2 px-6">
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {lastUpdated && (
              <span>Last updated: {formatTime(lastUpdated)}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={refreshData} title="Refresh Data">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <ToggleFullscreen />
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                <Settings className="mr-2 h-4 w-4" />
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
