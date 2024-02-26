import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

const MapComponent = () => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [startingPoint, setStartingPoint] = useState(null);
  const [endingPoint, setEndingPoint] = useState(null);

  useEffect(() => {
    const loadMap = async () => {
      mapboxgl.accessToken = "pk.eyJ1IjoiYWhhZGFsaWNob3dkaHVyeSIsImEiOiJjbHNkOW4wZ3owb2huMmlwYzlrMjhtN3JsIn0.osikVK11OS5BL6rK8ZKhYg";

      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [90.4113, 23.8103], // Default center
        zoom: 7,
      });

      setMap(newMap);

      const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'mapbox/driving',
        controls: {
          inputs: false,
          steps: false,
          instructions: false,
        },
      });

      directions.on("route", (event) => {
        if (event.route && event.route[0] && event.route[0].legs) {
          const leg = event.route[0].legs[0];
          setStartingPoint(leg.steps[0].maneuver.location);
          setEndingPoint(leg.steps[leg.steps.length - 1].maneuver.location);
        }
      });

      newMap.addControl(directions, 'top-left');
    };

    loadMap();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  // Function to get address from coordinates
  const getAddressFromCoordinates = async (coordinates) => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${mapboxgl.accessToken}`
    );
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      return data.features[0].place_name;
    }
    return "Unknown";
  };

  const [startPoint, setStartPoint] = useState(null)
  const [endPoint, setEndPoint] =useState(null);

  console.log(startPoint)
  console.log(endPoint)

  useEffect(() => {
    if (startingPoint) {
      getAddressFromCoordinates(startingPoint).then((address) => {
        setStartPoint(address)
      });
    }
    if (endingPoint) {
      getAddressFromCoordinates(endingPoint).then((address) => {
        setEndPoint(address)
      });
    }
  }, [startingPoint, endingPoint]);

  return (
    <div style={{ width: '100%', height: '500px' }} ref={mapContainer}>
      dfsdflf tej are dfl;;;;;;;;;;;;;;;;;;;;;;;;;;kfssfdk;sdfksdlf;lllllllllllllkfdsfdsf lksjfdskflsfdksdfklsdfklsddffsffsfsdfdsf
    </div>
  );
};

export default MapComponent;
