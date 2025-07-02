
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TrafficRoute {
  from: string;
  to: string;
  via: string;
  time: string;
  distance: string;
  status: string;
}

// Route definitions with coordinates for HERE API
const routes = [
  {
    from: "Seattle",
    to: "Everett",
    via: "I-5",
    fromCoords: "47.6062,-122.3321",
    toCoords: "47.9790,-122.2021"
  },
  {
    from: "Seattle", 
    to: "Tacoma",
    via: "I-5",
    fromCoords: "47.6062,-122.3321",
    toCoords: "47.2529,-122.4443"
  },
  {
    from: "Seattle",
    to: "Puyallup", 
    via: "SR 167",
    fromCoords: "47.6062,-122.3321",
    toCoords: "47.1854,-122.2929"
  },
  {
    from: "Everett",
    to: "Seattle",
    via: "I-5", 
    fromCoords: "47.9790,-122.2021",
    toCoords: "47.6062,-122.3321"
  },
  {
    from: "Tacoma",
    to: "Seattle",
    via: "I-5",
    fromCoords: "47.2529,-122.4443", 
    toCoords: "47.6062,-122.3321"
  },
  {
    from: "Puyallup",
    to: "Seattle",
    via: "SR 167",
    fromCoords: "47.1854,-122.2929",
    toCoords: "47.6062,-122.3321"
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const hereApiKey = Deno.env.get('HERE_API_KEY');
    
    if (!hereApiKey) {
      console.error('HERE_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'HERE API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('HERE_API_KEY found, length:', hereApiKey.length);
    console.log('Fetching traffic data for', routes.length, 'routes');
    
    // Fetch traffic data for all routes
    const trafficPromises = routes.map(async (route) => {
      try {
        const url = `https://router.hereapi.com/v8/routes?transportMode=car&origin=${route.fromCoords}&destination=${route.toCoords}&return=summary,actions&apikey=${hereApiKey}`;
        
        console.log(`Fetching route: ${route.from} to ${route.to}`);
        console.log(`URL: ${url.replace(hereApiKey, '[API_KEY_HIDDEN]')}`);
        
        const response = await fetch(url);
        console.log(`Response status for ${route.from} to ${route.to}:`, response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`HERE API error for ${route.from} to ${route.to}:`, response.status, errorText);
          throw new Error(`HERE API error: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log(`Response data for ${route.from} to ${route.to}:`, JSON.stringify(data, null, 2));
        
        if (!data.routes || data.routes.length === 0) {
          console.error(`No routes found for ${route.from} to ${route.to}`);
          throw new Error('No routes found');
        }
        
        const routeData = data.routes[0];
        const summary = routeData.summary;
        
        // Convert duration from seconds to minutes
        const durationMinutes = Math.round(summary.duration / 60);
        const distanceMiles = Math.round(summary.length / 1609.34); // Convert meters to miles
        
        // Determine traffic status based on duration and traffic info
        let status = "No major delays";
        if (summary.trafficTime && summary.baseTime) {
          const trafficDelay = (summary.trafficTime - summary.baseTime) / 60; // minutes
          if (trafficDelay > 15) {
            status = "Heavy traffic delays";
          } else if (trafficDelay > 5) {
            status = "Moderate traffic";
          }
        }
        
        console.log(`Successfully processed ${route.from} to ${route.to}: ${durationMinutes}min, ${distanceMiles}mi, ${status}`);
        
        return {
          from: route.from,
          to: route.to,
          via: route.via,
          time: `${durationMinutes} min`,
          distance: `${distanceMiles} mi`,
          status: status
        };
        
      } catch (error) {
        console.error(`Error fetching route ${route.from} to ${route.to}:`, error.message);
        
        // Return fallback data for this route
        return {
          from: route.from,
          to: route.to,
          via: route.via,
          time: "-- min",
          distance: "-- mi", 
          status: "Data unavailable"
        };
      }
    });
    
    const trafficData = await Promise.all(trafficPromises);
    console.log('Successfully processed all routes, returning data');
    
    return new Response(
      JSON.stringify({ routes: trafficData }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('Error in fetch-traffic function:', error.message);
    console.error('Stack trace:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch traffic data',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
