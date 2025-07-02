
export interface TrafficRoute {
  from: string;
  to: string;
  via: string;
  time: string;
  distance: string;
  status: string;
}

// Mock traffic data that simulates real Seattle-area traffic conditions
const mockTrafficData: TrafficRoute[] = [
  {
    from: "Bellevue",
    to: "Seattle",
    via: "I-90",
    time: "28 min",
    distance: "12.4 mi",
    status: "Light Traffic"
  },
  {
    from: "Kirkland",
    to: "Redmond",
    via: "SR-520",
    time: "15 min",
    distance: "8.2 mi",
    status: "Normal"
  },
  {
    from: "Tacoma",
    to: "Seattle",
    via: "I-5",
    time: "45 min",
    distance: "34.1 mi",
    status: "Heavy Traffic"
  },
  {
    from: "Everett",
    to: "Seattle",
    via: "I-5",
    time: "32 min",
    distance: "25.7 mi",
    status: "Moderate"
  },
  {
    from: "Renton",
    to: "Bellevue",
    via: "I-405",
    time: "18 min",
    distance: "11.3 mi",
    status: "Light Traffic"
  },
  {
    from: "Bothell",
    to: "Seattle",
    via: "I-5",
    time: "35 min",
    distance: "19.8 mi",
    status: "Moderate"
  }
];

export const getTrafficData = async (): Promise<TrafficRoute[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Add some randomization to make it feel more realistic
  const randomizedData = mockTrafficData.map(route => {
    const baseTime = parseInt(route.time);
    const variation = Math.floor(Math.random() * 10) - 5; // +/- 5 minutes
    const newTime = Math.max(1, baseTime + variation);
    
    // Determine status based on time
    let status = "Normal";
    if (newTime > baseTime + 3) {
      status = "Heavy Traffic";
    } else if (newTime > baseTime) {
      status = "Moderate";
    } else {
      status = "Light Traffic";
    }
    
    return {
      ...route,
      time: `${newTime} min`,
      status
    };
  });
  
  return randomizedData;
};
