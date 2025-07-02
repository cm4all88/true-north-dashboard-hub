
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const openWeatherApiKey = Deno.env.get('OPENWEATHER_API_KEY')
    
    if (!openWeatherApiKey) {
      throw new Error('OpenWeather API key not found')
    }

    console.log('Fetching weather data for Seattle...')

    // Fetch current weather and 5-day forecast
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=Seattle,US&appid=${openWeatherApiKey}&units=imperial`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Seattle,US&appid=${openWeatherApiKey}&units=imperial`)
    ])

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error('Failed to fetch weather data')
    }

    const currentData = await currentResponse.json()
    const forecastData = await forecastResponse.json()

    console.log('Weather data fetched successfully')

    // Process forecast data to get daily forecasts
    const dailyForecasts = []
    const processedDates = new Set()
    
    // Add today's weather first
    const today = new Date()
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    
    dailyForecasts.push({
      day: 'Today',
      high: Math.round(currentData.main.temp_max),
      low: Math.round(currentData.main.temp_min),
      condition: mapWeatherCondition(currentData.weather[0].main)
    })

    // Process forecast data for next 4 days
    for (const item of forecastData.list) {
      if (dailyForecasts.length >= 5) break
      
      const date = new Date(item.dt * 1000)
      const dateStr = date.toDateString()
      
      // Skip if we already processed this date or if it's today
      if (processedDates.has(dateStr) || date.toDateString() === today.toDateString()) {
        continue
      }
      
      processedDates.add(dateStr)
      
      // Get day name
      const dayName = dayNames[date.getDay()]
      
      dailyForecasts.push({
        day: dayName,
        high: Math.round(item.main.temp_max),
        low: Math.round(item.main.temp_min),
        condition: mapWeatherCondition(item.weather[0].main)
      })
    }

    // Check if we have existing weather data
    const { data: existingData } = await supabaseClient
      .from('weather_cache')
      .select('*')
      .eq('location', 'Seattle')
      .single()

    const weatherData = {
      location: 'Seattle',
      current_temp: Math.round(currentData.main.temp),
      current_condition: mapWeatherCondition(currentData.weather[0].main),
      forecast: dailyForecasts,
      last_updated: new Date().toISOString()
    }

    if (existingData) {
      // Update existing record
      const { error } = await supabaseClient
        .from('weather_cache')
        .update(weatherData)
        .eq('location', 'Seattle')
      
      if (error) throw error
      console.log('Weather data updated successfully')
    } else {
      // Insert new record
      const { error } = await supabaseClient
        .from('weather_cache')
        .insert(weatherData)
      
      if (error) throw error
      console.log('Weather data inserted successfully')
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Weather data updated successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in fetch-weather function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

function mapWeatherCondition(condition: string): string {
  const conditionMap: { [key: string]: string } = {
    'Clear': 'sunny',
    'Clouds': 'cloudy',
    'Rain': 'rainy',
    'Drizzle': 'rainy',
    'Thunderstorm': 'rainy',
    'Snow': 'cloudy',
    'Mist': 'cloudy',
    'Fog': 'cloudy',
    'Haze': 'cloudy'
  }
  
  return conditionMap[condition] || 'partly cloudy'
}
