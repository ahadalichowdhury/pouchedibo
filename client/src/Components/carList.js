import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import polyline from "@mapbox/polyline";
import { getProfileRequest } from "../ApiRequest/APIReguest";
import { errorToast, successToast } from "../Helper/FormHelper";

const CarList = () => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");

  useEffect(() => {
    const loadMap = async () => {
      // Set mapbox access token
      mapboxgl.accessToken =
        "pk.eyJ1IjoiYWhhZGFsaWNob3dkaHVyeSIsImEiOiJjbHNkOW4wZ3owb2huMmlwYzlrMjhtN3JsIn0.osikVK11OS5BL6rK8ZKhYg";

      // Create map instance
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [90.4113, 23.8103], // Bangladesh coordinates
        zoom: 7,
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

  useEffect(() => {
    if (map) {
      fetchDirections();
    }
  }, [map]);

  useEffect(() => {
    const startLocation = localStorage.getItem("startLocation");
    const endLocation = localStorage.getItem("endLocation");
    setStartLocation(startLocation);
    setEndLocation(endLocation);
  }, []);

  const pricePerKm = 20;
  const [distance, setDistance] = useState(null);
  const [price, setPrice] = useState(null);

  // console.log("distance", distance)
  const fetchDirections = async () => {
    if (!map || !startLocation || !endLocation) return;

    try {
      const startCoordinates = await geocodeLocation(startLocation);
      const endCoordinates = await geocodeLocation(endLocation);

      if (!startCoordinates || !endCoordinates) {
        console.error(
          "Error: Unable to find coordinates for start or end location"
        );
        return;
      }

      const response = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoordinates};${endCoordinates}?steps=true&access_token=${mapboxgl.accessToken}`
      );

      const route = response.data.routes[0];
      const routeGeometry = route.geometry;
      const distanceInMeters = route.distance;
      const distanceInKilometers = (distanceInMeters / 1000).toFixed(2);

      setDistance(distanceInKilometers);

      // Calculate the total price based on the distance
      const totalPrice = (distanceInKilometers * pricePerKm).toFixed(2);

      setPrice(totalPrice);

      const decodedRouteGeometry = polyline
        .decode(routeGeometry)
        .map((point) => {
          return [point[1], point[0]]; // Swap coordinates (latitude, longitude) to (longitude, latitude)
        });

      if (map.getSource("route")) {
        map.removeSource("route");
      }

      if (map.getLayer("directions")) {
        map.removeLayer("directions");
      }

      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: decodedRouteGeometry,
          },
        },
      });

      map.addLayer({
        id: "directions",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3887be",
          "line-width": 5,
        },
      });
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  const geocodeLocation = async (location) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${mapboxgl.accessToken}`
      );
      const features = response.data.features;
      if (features.length > 0) {
        return features[0].geometry.coordinates.join(",");
      } else {
        console.error(`Error: No coordinates found for location '${location}'`);
        return null;
      }
    } catch (error) {
      console.error("Error geocoding location:", error);
      return null;
    }
  };

  const [carData, setCarData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/vehicles"
        );
        setCarData(response.data.data);
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };

    fetchData();
  }, []);

  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState(null);
  console.log(userId);
  //get profile info
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios
          .get("http://localhost:8000/api/v1/profileDetails", {
            headers: {
              token: `${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            console.log(res.data.data[0]._id);
            setUserId(res.data.data[0]._id);
          });
      } catch (error) {
        errorToast(error.message);
      }
    };

    fetchData();
  }, []);
  const handleBookNow = async (carId, carName) => {
    try {
      console.log("Clicked 'Book Now' for car with ID:", carId);

      console.log("user id", userId);
      const payload = {
        vehicleId: carId,
        senderUserId: userId,
        startLocation,
        endLocation,
      };

      const response = await axios
        .put("http://localhost:8000/api/v1/sendNotification", payload, {
          headers: {
            token: `${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          // console.log("Notification sent successfully:", response.data);
          successToast(
            `Successfully sent the notification  ${carName} for availabe driver`
          );
          setTimeout(() => {
            window.location.href = "/senderWaiting";
          }, 2000);
        });
    } catch (error) {
      errorToast("driver is not available for this type of car");
    }
  };
  return (
    <div className="carListCard">
      <div className="carList-upper-part">
        <div>
          <div
            ref={mapContainer}
            className="map-container"
            style={{ width: "100%", height: "400px" }}
          />
        </div>
      </div>
      <div>
        <p style={{ color: "red", fontSize: "20px" }}>
          total Distance: {distance} km
        </p>
        <p style={{ color: "red", fontSize: "20px" }}>
          total Ammount: {price} BDT
        </p>
      </div>
      <div className="carList-lower-part mt-5">
        <ul className="car-list">
          {carData.map((car, index) => (
            <div key={index} className="car-item">
              <div>
                <img
                  src={car.vehicleImage}
                  alt={car.vehicleName}
                  className="car-image"
                />
                <span>{car.vehicleName}</span>
              </div>
              <div>
                <button
                  className="BookNowbutton"
                  onClick={() => handleBookNow(car._id, car.vehicleName)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
          {/* <div className="car-item">
            <div>
              <img src={Car_image1} alt="Car 1" className="car-image"/>
              <span>ED STREET TEXI</span>
            </div>
            <div>
              <button className="BookNowbutton">Book Now</button>
            </div>
          </div> */}
        </ul>
      </div>
    </div>
  );
};

export default CarList;
