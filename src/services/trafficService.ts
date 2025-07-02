
import { supabase } from '@/integrations/supabase/client';

export interface TrafficRoute {
  from: string;
  to: string;
  via: string;
  time: string;
  distance: string;
  status: string;
}

export async function getTrafficData(): Promise<TrafficRoute[]> {
  try {
    console.log('Fetching traffic data from edge function...');
    
    const { data, error } = await supabase.functions.invoke('fetch-traffic');
    
    if (error) {
      console.error('Error calling traffic function:', error);
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
}

function getFallbackTrafficData(): TrafficRoute[] {
  console.log('Using fallback traffic data');
  
  return [
    {
      from: "Seattle",
      to: "Everett",
      via: "I-5",
      time: "35 min",
      distance: "28 mi",
      status: "No major delays",
    },
    {
      from: "Seattle",
      to: "Tacoma",
      via: "I-5",
      time: "40 min",
      distance: "34 mi",
      status: "Heavy traffic near airport",
    },
    {
      from: "Seattle",
      to: "Puyallup",
      via: "SR 167",
      time: "45 min",
      distance: "38 mi",
      status: "Moderate traffic",
    },
    {
      from: "Everett",
      to: "Seattle",
      via: "I-5",
      time: "42 min",
      distance: "28 mi",
      status: "Accident at Northgate",
    },
    {
      from: "Tacoma",
      to: "Seattle",
      via: "I-5",
      time: "38 min",
      distance: "34 mi",
      status: "No major delays",
    },
    {
      from: "Puyallup",
      to: "Seattle",
      via: "SR 167",
      time: "50 min",
      distance: "38 mi",
      status: "Construction delays",
    },
  ];
}
