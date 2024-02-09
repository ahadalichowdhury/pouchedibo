import React, { useEffect, useRef, useState } from "react";
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import polyline from '@mapbox/polyline';
function Testing() {
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  const directionsLayer = useRef(null);
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");

  useEffect(() => {
    const loadMap = async () => {
      // Dynamically load mapbox-gl library
      

      // Set mapbox access token
      mapboxgl.accessToken = "pk.eyJ1IjoiYWhhZGFsaWNob3dkaHVyeSIsImEiOiJjbHNkOW4wZ3owb2huMmlwYzlrMjhtN3JsIn0.osikVK11OS5BL6rK8ZKhYg";

      // Create map instance
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [90.4113, 23.8103], // Bangladesh coordinates
        zoom: 7
      });

      setMap(newMap);
    };

    loadMap();

    return () => {
      // Cleanup map instance
      if (map) {
        map.remove();
      }
    };
  }, []);

  

const handleFormSubmit = async (e) => {
  e.preventDefault();
  if (!map) return; // Ensure map is initialized before proceeding

  // Convert start and end location names to coordinates
  const startCoordinates = await geocodeLocation(startLocation);
  const endCoordinates = await geocodeLocation(endLocation);

  console.log('Start coordinates:', startCoordinates);
  console.log('End coordinates:', endCoordinates);

  if (!startCoordinates || !endCoordinates) {
    console.error('Error: Unable to find coordinates for start or end location');
    return;
  }

  // Make a request to Mapbox Directions API with coordinates
  try {
    const response = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${startCoordinates};${endCoordinates}?steps=true&access_token=${mapboxgl.accessToken}`);
    console.log('Directions API response:', response.data); // Log the response data for debugging

    // Extract route geometry from the response
    const routeGeometry = response.data.routes[0].geometry;

    // Decode the polyline string into a GeoJSON object
    const decodedRouteGeometry = polyline.decode(routeGeometry).map((point) => {
      return [point[1], point[0]]; // Swap coordinates (latitude, longitude) to (longitude, latitude)
    });

    // Add the decoded route geometry as a GeoJSON source to the map
    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: decodedRouteGeometry
        }
      }
    });

    // Add a layer to render the direction line
    map.addLayer({
      id: 'directions',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3887be',
        'line-width': 5
      }
    });
  } catch (error) {
    console.error('Error fetching directions:', error);
  }
};

  
  
  

  // Function to geocode a location name to coordinates
  const geocodeLocation = async (location) => {
    try {
      const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${mapboxgl.accessToken}`);
      const features = response.data.features;
      if (features.length > 0) {
        // Get the first feature (most relevant) and return its coordinates
        return features[0].geometry.coordinates.join(',');
      } else {
        console.error(`Error: No coordinates found for location '${location}'`);
        return null;
      }
    } catch (error) {
      console.error('Error geocoding location:', error);
      return null;
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Start location"
          value={startLocation}
          onChange={(e) => setStartLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="End location"
          value={endLocation}
          onChange={(e) => setEndLocation(e.target.value)}
        />
        <button type="submit">Get Directions</button>
      </form>
      <div>
        <div ref={mapContainer} className="map-container" style={{ width: "100%", height: "400px" }} />
      </div>
    </div>
  );
}

export default Testing;
