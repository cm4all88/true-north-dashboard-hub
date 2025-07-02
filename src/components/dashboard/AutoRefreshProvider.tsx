
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useDashboardData } from '@/contexts/DashboardDataContext';

interface AutoRefreshContextType {
  lastUpdated: Date | null;
  refreshData: () => void;
}

const AutoRefreshContext = createContext<AutoRefreshContextType>({
  lastUpdated: null,
  refreshData: () => {},
});

export const useAutoRefresh = () => useContext(AutoRefreshContext);

interface AutoRefreshProviderProps {
  children: ReactNode;
  refreshInterval?: number; // in milliseconds
}

export const AutoRefreshProvider: React.FC<AutoRefreshProviderProps> = ({ 
  children, 
  refreshInterval = 900000 // 15 minutes default
}) => {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { refreshData: refreshDashboardData } = useDashboardData();

  const refreshData = () => {
    refreshDashboardData();
    setLastUpdated(new Date());
  };

  useEffect(() => {
    // Set initial timestamp
    setLastUpdated(new Date());

    // Set up auto-refresh interval
    const interval = setInterval(() => {
      refreshData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return (
    <AutoRefreshContext.Provider value={{ lastUpdated, refreshData }}>
      {children}
    </AutoRefreshContext.Provider>
  );
};
