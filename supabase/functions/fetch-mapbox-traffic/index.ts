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

// Route definitions with coordinates for Mapbox API
const routes = [
  {
    from: "Bellevue",
    to: "Seattle", 
    via: "I-90",
    fromCoords: "-122.2015,47.6101",
    toCoords: "-122.3321,47.6062"
  },
  {
    from: "Kirkland",
    to: "Redmond",
    via: "SR-520", 
    fromCoords: "-122.2087,47.6769",
    toCoords: "-122.1215,47.6740"
  },
  {
    from: "Tacoma",
    to: "Seattle",
    via: "I-5",
    fromCoords: "-122.4443,47.2529",
    toCoords: "-122.3321,47.6062"
  },
  {
    from: "Everett", 
    to: "Seattle",
    via: "I-5",
    fromCoords: "-122.2021,47.9790",
    toCoords: "-122.3321,47.6062"
  },
  {
    from: "Renton",
    to: "Bellevue",
    via: "I-405",
    fromCoords: "-122.2143,47.4829",
    toCoords: "-122.2015,47.6101"
  },
  {
    from: "Bothell",
    to: "Seattle", 
    via: "I-5",
    fromCoords: "-122.2054,47.7623",
    toCoords: "-122.3321,47.6062"
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const mapboxApiKey = Deno.env.get('MAPBOX_API_KEY');
    
    if (!mapboxApiKey) {
      console.error('MAPBOX_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'Mapbox API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('MAPBOX_API_KEY found, starting traffic data fetch...');
    
    // Fetch traffic data for all routes
    const trafficPromises = routes.map(async (route) => {
      try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${route.fromCoords};${route.toCoords}?access_token=${mapboxApiKey}&geometries=geojson&overview=full`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error(`Mapbox API error for ${route.from} to ${route.to}: ${response.status}`);
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.routes || data.routes.length === 0) {
          console.error(`No routes found for ${route.from} to ${route.to}`);
          throw new Error('No routes found');
        }
        
        const routeData = data.routes[0];
        
        // Convert duration from seconds to minutes
        const durationMinutes = Math.round(routeData.duration / 60);
        const distanceMiles = Math.round(routeData.distance * 0.000621371); // Convert meters to miles
        
        // Determine traffic status based on duration
        let status = "Light Traffic";
        if (durationMinutes > 45) {
          status = "Heavy Traffic";
        } else if (durationMinutes > 25) {
          status = "Moderate";
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
    console.error('Error in fetch-mapbox-traffic function:', error.message);
    
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