
import React, { createContext, useContext, useEffect, useState } from 'react';

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
  children: React.ReactNode;
  refreshInterval?: number; // milliseconds
}

export const AutoRefreshProvider: React.FC<AutoRefreshProviderProps> = ({ 
  children, 
  refreshInterval = 900000 // Default 15 minutes
}) => {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());

  const refreshData = () => {
    // Update timestamp
    setLastUpdated(new Date());
    
    // This is where you would trigger all the data refreshes
    console.log('Data refreshed at:', new Date().toLocaleTimeString());
    
    // You could emit an event or call specific refresh functions here
    window.dispatchEvent(new CustomEvent('dashboard-refresh'));
  };

  useEffect(() => {
    // Set up auto-refresh interval
    const intervalId = setInterval(refreshData, refreshInterval);
    
    // Initial refresh
    refreshData();
    
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  return (
    <AutoRefreshContext.Provider value={{ lastUpdated, refreshData }}>
      {children}
    </AutoRefreshContext.Provider>
  );
};
