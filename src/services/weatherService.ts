
import { supabase } from '@/integrations/supabase/client';

export interface WeatherData {
  day: string;
  high: number;
  low: number;
  condition: string;
}

export interface WeatherCache {
  id: string;
  location: string;
  current_temp: number;
  current_condition: string;
  forecast: WeatherData[];
  last_updated: string;
  created_at: string;
}

export async function getWeatherData(): Promise<WeatherData[]> {
  try {
    const { data, error } = await supabase
      .from('weather_cache')
      .select('*')
      .eq('location', 'Seattle')
      .single();

    if (error) {
      console.error('Error fetching weather data:', error);
      // Return fallback data if database fetch fails
      return getFallbackWeatherData();
    }

    if (data && data.forecast) {
      // Properly cast the JSON data to WeatherData[]
      const forecast = data.forecast as unknown as WeatherData[];
      
      // Validate that the forecast data has the expected structure
      if (Array.isArray(forecast) && forecast.length > 0 && 
          forecast[0].day !== undefined && 
          forecast[0].high !== undefined && 
          forecast[0].low !== undefined && 
          forecast[0].condition !== undefined) {
        return forecast;
      }
    }

    return getFallbackWeatherData();
  } catch (error) {
    console.error('Error in getWeatherData:', error);
    return getFallbackWeatherData();
  }
}

export async function refreshWeatherData(): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke('fetch-weather');
    
    if (error) {
      console.error('Error refreshing weather data:', error);
    } else {
      console.log('Weather data refreshed successfully');
    }
  } catch (error) {
    console.error('Error invoking weather refresh:', error);
  }
}

function getFallbackWeatherData(): WeatherData[] {
  // Return default mock data as fallback
  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const conditions = ['sunny', 'cloudy', 'rainy', 'partly cloudy'];
  
  const forecast = [];
  
  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayName = i === 0 ? 'Today' : dayNames[date.getDay()];
    const condition = conditions[i % conditions.length];
    
    const baseTemp = 65;
    const variation = Math.sin(i * 0.5) * 8;
    const high = Math.round(baseTemp + variation + Math.random() * 6);
    const low = Math.round(high - 10 - Math.random() * 6);
    
    forecast.push({
      day: dayName,
      high,
      low,
      condition
    });
  }
  
  return forecast;
}
