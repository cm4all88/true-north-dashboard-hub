import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ScheduleItem {
  jobCode: string;
  description: string;
  projectManager?: string;
}

interface CrewMember {
  position: string;
  name: string;
  schedule: ScheduleItem[];
}

interface WeekData {
  weekOf: string;
  days: string[];
  dates: string[];
  crews: CrewMember[];
}

interface Birthday {
  name: string;
  date: Date;
}

interface Shoutout {
  id: number;
  text: string;
  from: string;
  date: Date;
}

interface DashboardData {
  scheduleData: WeekData[];
  birthdays: Birthday[];
  shoutouts: Shoutout[];
}

interface DashboardDataContextType {
  data: DashboardData;
  updateScheduleData: (newScheduleData: WeekData[]) => void;
  updateBirthdays: (newBirthdays: Birthday[]) => void;
  updateShoutouts: (newShoutouts: Shoutout[]) => void;
}

// Function to get Monday of current week
const getMondayOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
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

// Generate initial data
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
          name: "SHAUN",
          schedule: [
            { jobCode: `j18-${18 + weekOffset}`, description: "test", projectManager: "John Smith" },
            { jobCode: `j18-${18 + weekOffset}`, description: "test", projectManager: "John Smith" },
            { jobCode: `j18-${183 + weekOffset}`, description: "test", projectManager: "Sarah Jones" },
            { jobCode: `j18-${184 + weekOffset}`, description: "test", projectManager: "Mike Davis" },
            { jobCode: `j18-${185 + weekOffset}`, description: "test", projectManager: "Mike Davis" },
          ]
        },
        {
          position: "TAYLOR",
          name: "GERRY",
          schedule: [
            { jobCode: `j19-${18 + weekOffset}`, description: "test", projectManager: "John Smith" },
            { jobCode: `j19-${18 + weekOffset}`, description: "test", projectManager: "John Smith" },
            { jobCode: `j19-${183 + weekOffset}`, description: "test", projectManager: "Sarah Jones" },
            { jobCode: `j19-${184 + weekOffset}`, description: "test", projectManager: "Mike Davis" },
            { jobCode: `j19-${185 + weekOffset}`, description: "test", projectManager: "Mike Davis" },
          ]
        },
        {
          position: "DOMINIC",
          name: "SERGIO",
          schedule: [
            { jobCode: `j20-${11 + weekOffset}`, description: "test", projectManager: "Emily Wilson" },
            { jobCode: `j20-${11 + weekOffset}`, description: "test", projectManager: "Emily Wilson" },
            { jobCode: `j20-${113 + weekOffset}`, description: "test", projectManager: "Sarah Jones" },
            { jobCode: `j20-${114 + weekOffset}`, description: "test", projectManager: "Mike Davis" },
            { jobCode: `j20-${115 + weekOffset}`, description: "test", projectManager: "John Smith" },
          ]
        },
        {
          position: "OFF",
          name: "",
          schedule: [
            { jobCode: "", description: "" },
            { jobCode: "", description: "" },
            { jobCode: "", description: "" },
            { jobCode: "", description: "" },
            { jobCode: "", description: "" },
          ]
        },
      ]
    };
  };

  return [
    generateWeekData(currentMonday, 0),
    generateWeekData(nextMonday, 4)
  ];
};

const initialData: DashboardData = {
  scheduleData: generateInitialScheduleData(),
  birthdays: [
    { name: 'Alex Johnson', date: new Date('2023-04-15') },
    { name: 'Maria Garcia', date: new Date('2023-04-22') },
    { name: 'James Wilson', date: new Date('2023-04-30') },
    { name: 'Beth Chen', date: new Date('2023-05-05') },
    { name: 'Omar Patel', date: new Date('2023-05-17') },
  ],
  shoutouts: [
    { 
      id: 1, 
      text: "Shoutout to Mike for helping on the Saturday rush job!", 
      from: "Sarah Kim",
      date: new Date('2023-04-18')
    },
    { 
      id: 2, 
      text: "Thanks to Beth for staying late to finish the downtown project documentation!",
      from: "James Wilson", 
      date: new Date('2023-04-17') 
    },
    { 
      id: 3, 
      text: "Kudos to the entire field team for completing the Westlake survey ahead of schedule.", 
      from: "Omar Patel",
      date: new Date('2023-04-15') 
    },
  ]
};

const DashboardDataContext = createContext<DashboardDataContextType>({
  data: initialData,
  updateScheduleData: () => {},
  updateBirthdays: () => {},
  updateShoutouts: () => {},
});

export const useDashboardData = () => useContext(DashboardDataContext);

interface DashboardDataProviderProps {
  children: ReactNode;
}

export const DashboardDataProvider: React.FC<DashboardDataProviderProps> = ({ children }) => {
  const [data, setData] = useState<DashboardData>(initialData);

  const updateScheduleData = (newScheduleData: WeekData[]) => {
    setData(prev => ({ ...prev, scheduleData: newScheduleData }));
  };

  const updateBirthdays = (newBirthdays: Birthday[]) => {
    setData(prev => ({ ...prev, birthdays: newBirthdays }));
  };

  const updateShoutouts = (newShoutouts: Shoutout[]) => {
    setData(prev => ({ ...prev, shoutouts: newShoutouts }));
  };

  return (
    <DashboardDataContext.Provider value={{
      data,
      updateScheduleData,
      updateBirthdays,
      updateShoutouts
    }}>
      {children}
    </DashboardDataContext.Provider>
  );
};
