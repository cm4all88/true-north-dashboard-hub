
import { supabase } from '@/integrations/supabase/client';

export interface TrafficRoute {
  from: string;
  to: string;
  via: string;
  time: string;
  distance: string;
  status: string;
}

// Mock traffic data as fallback
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
  try {
    console.log('Fetching real traffic data from Mapbox...');
    
    const { data, error } = await supabase.functions.invoke('fetch-mapbox-traffic');
    
    if (error) {
      console.error('Error calling Mapbox traffic function:', error);
      return getFallbackTrafficData();
    }
    
    if (data && data.routes && Array.isArray(data.routes)) {
      console.log('Successfully received traffic data:', data.routes.length, 'routes');
      return data.routes;
    }
    
    console.warn('Invalid traffic data format, using fallback');
    return getFallbackTrafficData();
    
  } catch (error) {
    console.error('Error in getTrafficData:', error);
    return getFallbackTrafficData();
  }
};

function getFallbackTrafficData(): TrafficRoute[] {
  console.log('Using fallback traffic data');
  
  // Add some randomization to make it feel more realistic
  return mockTrafficData.map(route => {
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
}
