
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

    console.log('HERE_API_KEY found, starting traffic data fetch...');
    
    // Test with a single route first to debug the API call
    const testRoute = routes[0];
    const testUrl = `https://router.hereapi.com/v8/routes?transportMode=car&origin=${testRoute.fromCoords}&destination=${testRoute.toCoords}&return=summary&apikey=${hereApiKey}`;
    
    console.log(`Testing single route: ${testRoute.from} to ${testRoute.to}`);
    
    try {
      const testResponse = await fetch(testUrl);
      console.log(`Test response status: ${testResponse.status}`);
      
      if (!testResponse.ok) {
        const errorText = await testResponse.text();
        console.error(`HERE API test error: ${testResponse.status} - ${errorText}`);
        
        // Return fallback data with specific error info
        const fallbackRoutes = routes.map(route => ({
          from: route.from,
          to: route.to,
          via: route.via,
          time: "-- min",
          distance: "-- mi",
          status: `API Error ${testResponse.status}`
        }));
        
        return new Response(
          JSON.stringify({ routes: fallbackRoutes }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      const testData = await testResponse.json();
      console.log('Test API call successful, proceeding with all routes...');
      
    } catch (testError) {
      console.error('Test API call failed:', testError.message);
      
      // Return fallback data with network error info
      const fallbackRoutes = routes.map(route => ({
        from: route.from,
        to: route.to,
        via: route.via,
        time: "-- min",
        distance: "-- mi",
        status: "Network Error"
      }));
      
      return new Response(
        JSON.stringify({ routes: fallbackRoutes }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Fetch traffic data for all routes
    const trafficPromises = routes.map(async (route) => {
      try {
        const url = `https://router.hereapi.com/v8/routes?transportMode=car&origin=${route.fromCoords}&destination=${route.toCoords}&return=summary&apikey=${hereApiKey}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error(`HERE API error for ${route.from} to ${route.to}: ${response.status}`);
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
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
        
        console.log(`Successfully processed ${route.from} to ${route.to}: ${durationMinutes}min, ${distanceMiles}mi`);
        
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
    console.log('Traffic data processing complete');
    
    return new Response(
      JSON.stringify({ routes: trafficData }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('Error in fetch-traffic function:', error.message);
    
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
