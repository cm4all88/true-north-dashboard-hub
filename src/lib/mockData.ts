
// Mock data for the True North Dashboard

// Crew Schedule
export const crewScheduleMock = {
  Monday: ['Alex Johnson', 'Maria Garcia', 'Darnell Williams'],
  Tuesday: ['Beth Chen', 'Omar Patel', 'Sarah Kim'],
  Wednesday: ['James Wilson', 'Maria Garcia', 'Darnell Williams'],
  Thursday: ['Beth Chen', 'Omar Patel', 'Alex Johnson'],
  Friday: ['James Wilson', 'Sarah Kim', 'Omar Patel'],
};

// Weather Forecast for Seattle
export const weatherForecastMock = [
  { day: 'Today', high: 72, low: 56, condition: 'sunny' },
  { day: 'Tue', high: 65, low: 52, condition: 'cloudy' },
  { day: 'Wed', high: 60, low: 51, condition: 'rainy' },
  { day: 'Thu', high: 64, low: 54, condition: 'partly cloudy' },
  { day: 'Fri', high: 68, low: 55, condition: 'sunny' },
  { day: 'Sat', high: 70, low: 56, condition: 'sunny' },
  { day: 'Sun', high: 65, low: 53, condition: 'rainy' },
];

// Upcoming Birthdays
export const birthdaysMock = [
  { name: 'Alex Johnson', date: '2023-04-15', formatted: 'April 15' },
  { name: 'Maria Garcia', date: '2023-04-22', formatted: 'April 22' },
  { name: 'James Wilson', date: '2023-04-30', formatted: 'April 30' },
  { name: 'Beth Chen', date: '2023-05-05', formatted: 'May 5' },
  { name: 'Omar Patel', date: '2023-05-17', formatted: 'May 17' },
];

// Team Shoutouts
export const shoutoutsMock = [
  { 
    id: 1, 
    text: "Shoutout to Mike for helping on the Saturday rush job!", 
    from: "Sarah Kim",
    date: "2023-04-18" 
  },
  { 
    id: 2, 
    text: "Thanks to Beth for staying late to finish the downtown project documentation!",
    from: "James Wilson", 
    date: "2023-04-17" 
  },
  { 
    id: 3, 
    text: "Kudos to the entire field team for completing the Westlake survey ahead of schedule.", 
    from: "Omar Patel",
    date: "2023-04-15" 
  },
];

// Helper functions for date formatting and calculations
export const formatDateHelper = (date: Date) => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

export const formatTimeHelper = (date: Date) => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

export const isToday = (day: string) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  return day === today;
};

export const getCurrentWeekRange = () => {
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Find the date of the Monday of this week
  const mondayDate = new Date(today);
  mondayDate.setDate(today.getDate() - day + (day === 0 ? -6 : 1));
  
  // Find the date of the Friday of this week
  const fridayDate = new Date(mondayDate);
  fridayDate.setDate(mondayDate.getDate() + 4);
  
  // Format the dates
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  return `${formatDate(mondayDate)} - ${formatDate(fridayDate)}`;
};
