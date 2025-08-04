
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getScheduleData, 
  getBirthdays, 
  getShoutouts, 
  saveScheduleData, 
  saveBirthdays, 
  saveShoutouts,
  type WeekData,
  type BirthdayData,
  type ShoutoutData
} from '@/services/supabaseService';

interface DashboardData {
  scheduleData: WeekData[];
  birthdays: BirthdayData[];
  shoutouts: ShoutoutData[];
}

interface DashboardDataContextType {
  data: DashboardData;
  loading: boolean;
  error: string | null;
  updateScheduleData: (newScheduleData: WeekData[]) => Promise<void>;
  updateBirthdays: (newBirthdays: BirthdayData[]) => Promise<void>;
  updateShoutouts: (newShoutouts: ShoutoutData[]) => Promise<void>;
  refreshData: () => Promise<void>;
}

// Function to get Monday of current week
const getMondayOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

// Function to format date as M/D/YYYY
const formatDate = (date: Date) => {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

// Function to get week range string
const getWeekRange = (mondayDate: Date) => {
  const friday = new Date(mondayDate);
  friday.setDate(mondayDate.getDate() + 4);
  
  const mondayMonth = mondayDate.toLocaleDateString('en-US', { month: 'short' });
  const mondayDay = mondayDate.getDate();
  const fridayMonth = friday.toLocaleDateString('en-US', { month: 'short' });
  const fridayDay = friday.getDate();
  const year = mondayDate.getFullYear();
  
  return `${mondayMonth} ${mondayDay} - ${fridayMonth} ${fridayDay}, ${year}`;
};

// Generate initial data as fallback
const generateInitialScheduleData = (): WeekData[] => {
  const currentMonday = getMondayOfWeek(new Date());
  const nextMonday = new Date(currentMonday);
  nextMonday.setDate(currentMonday.getDate() + 7);

  const generateWeekData = (monday: Date, weekOffset: number = 0): WeekData => {
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(formatDate(date));
    }

    return {
      weekOf: getWeekRange(monday),
      days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
      dates,
      crews: [
        {
          position: "TIM",
          name: "ANDREAS",
          schedule: [
            { 
              row1: { color: 'orange', jobNumber: `j18-${18 + weekOffset}`, jobName: 'test' },
              row2: { color: 'none', jobNumber: '', jobName: '' }
            },
            { 
              row1: { color: 'orange', jobNumber: `j18-${18 + weekOffset}`, jobName: 'test' },
              row2: { color: 'none', jobNumber: '', jobName: '' }
            },
            { 
              row1: { color: 'blue', jobNumber: `j18-${183 + weekOffset}`, jobName: 'test' },
              row2: { color: 'none', jobNumber: '', jobName: '' }
            },
            { 
              row1: { color: 'green', jobNumber: `j18-${184 + weekOffset}`, jobName: 'test' },
              row2: { color: 'none', jobNumber: '', jobName: '' }
            },
            { 
              row1: { color: 'green', jobNumber: `j18-${185 + weekOffset}`, jobName: 'test' },
              row2: { color: 'none', jobNumber: '', jobName: '' }
            },
          ]
        },
        {
          position: "TAYLOR",
          name: "GERRY",
          schedule: [
            { 
              row1: { color: 'orange', jobNumber: `j19-${18 + weekOffset}`, jobName: 'test' },
              row2: { color: 'none', jobNumber: '', jobName: '' }
            },
            { 
              row1: { color: 'orange', jobNumber: `j19-${18 + weekOffset}`, jobName: 'test' },
              row2: { color: 'none', jobNumber: '', jobName: '' }
            },
            { 
              row1: { color: 'blue', jobNumber: `j19-${183 + weekOffset}`, jobName: 'test' },
              row2: { color: 'none', jobNumber: '', jobName: '' }
            },
            { 
              row1: { color: 'green', jobNumber: `j19-${184 + weekOffset}`, jobName: 'test' },
              row2: { color: 'none', jobNumber: '', jobName: '' }
            },
            { 
              row1: { color: 'green', jobNumber: `j19-${185 + weekOffset}`, jobName: 'test' },
              row2: { color: 'none', jobNumber: '', jobName: '' }
            },
          ]
        },
        {
          position: "LIAM",
          name: "SERGIO",
          schedule: [
            { 
              row1: { color: 'purple', jobNumber: `j20-${11 + weekOffset}`, jobName: 'test' },
              row2: { color: 'none', jobNumber: '', jobName: '' }
            },
            { 
              row1: { color: 'purple', jobNumber: `j20-${11 + weekOffset}`, jobName: 'test' },
              row2: { color: 'none', jobNumber: '', jobName: '' }
            },
            { 
              row1: { color: 'blue', jobNumber: `j20-${113 + weekOffset}`, jobName: 'test' },
              row2: { color: 'none', jobNumber: '', jobName: '' }
            },
            { 
              row1: { color: 'green', jobNumber: `j20-${114 + weekOffset}`, jobName: 'test' },
              row2: { color: 'none', jobNumber: '', jobName: '' }
            },
            { 
              row1: { color: 'orange', jobNumber: `j20-${115 + weekOffset}`, jobName: 'test' },
              row2: { color: 'none', jobNumber: '', jobName: '' }
            },
          ]
        },
      ]
    };
  };

  return [
    generateWeekData(currentMonday, 0),
    generateWeekData(nextMonday, 1)
  ];
};

const initialData: DashboardData = {
  scheduleData: [],
  birthdays: [],
  shoutouts: []
};

const DashboardDataContext = createContext<DashboardDataContextType>({
  data: initialData,
  loading: false,
  error: null,
  updateScheduleData: async () => {},
  updateBirthdays: async () => {},
  updateShoutouts: async () => {},
  refreshData: async () => {},
});

export const useDashboardData = () => useContext(DashboardDataContext);

interface DashboardDataProviderProps {
  children: ReactNode;
}

export const DashboardDataProvider: React.FC<DashboardDataProviderProps> = ({ children }) => {
  const [data, setData] = useState<DashboardData>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [scheduleData, birthdays, shoutouts] = await Promise.all([
        getScheduleData(),
        getBirthdays(),
        getShoutouts()
      ]);

      // Use the real data from database
      setData({ scheduleData, birthdays, shoutouts });
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
      // Fallback to sample data
      setData({
        scheduleData: generateInitialScheduleData(),
        birthdays: [
          { name: 'Alex Johnson', date: new Date('2023-04-15') },
          { name: 'Maria Garcia', date: new Date('2023-04-22') },
        ],
        shoutouts: [
          { 
            id: 1, 
            text: "Shoutout to Mike for helping on the Saturday rush job!", 
            from: "Sarah Kim",
            date: new Date('2023-04-18')
          },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateScheduleData = async (newScheduleData: WeekData[]) => {
    try {
      await saveScheduleData(newScheduleData);
      setData(prev => ({ ...prev, scheduleData: newScheduleData }));
    } catch (err) {
      console.error('Error updating schedule data:', err);
      setError('Failed to save schedule data');
    }
  };

  const updateBirthdays = async (newBirthdays: BirthdayData[]) => {
    try {
      await saveBirthdays(newBirthdays);
      setData(prev => ({ ...prev, birthdays: newBirthdays }));
    } catch (err) {
      console.error('Error updating birthdays:', err);
      setError('Failed to save birthdays');
    }
  };

  const updateShoutouts = async (newShoutouts: ShoutoutData[]) => {
    try {
      await saveShoutouts(newShoutouts);
      setData(prev => ({ ...prev, shoutouts: newShoutouts }));
    } catch (err) {
      console.error('Error updating shoutouts:', err);
      setError('Failed to save shoutouts');
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  return (
    <DashboardDataContext.Provider value={{
      data,
      loading,
      error,
      updateScheduleData,
      updateBirthdays,
      updateShoutouts,
      refreshData
    }}>
      {children}
    </DashboardDataContext.Provider>
  );
};
