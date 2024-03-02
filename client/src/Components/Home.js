import React, { useEffect, useRef, useState } from "react";
import "../assets/css/style.css";
import axios from "axios";
import { errorToast, successToast } from "../Helper/FormHelper";
import { Button } from "react-bootstrap";
import { AddressAutofill } from "@mapbox/search-js-react";
import MapComponent from "./MapComponent";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [accepted, isAccepted] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [isVarified, setIsVarified] = useState(null);
  console.log("user data", userData);
  // console.log("accepted ",accepted)
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios
          .get("http://localhost:8000/api/v1/ownProfileDetails", {
            headers: {
              token: `${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            isAccepted(res.data.data?.request?.isAccepted);
            setUserData(res.data.data);
            setIsVarified(res?.data?.data?.is_registered);
          });
      } catch (error) {
        errorToast(error.message);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = () => {
    const from = startPoint;
    const to = endPoint;

    const token = localStorage.getItem("token");

    axios
      .post(
        `http://localhost:8000/api/v1/createHistory`,
        {
          from,
          to,
        },
        {
          headers: {
            token: `${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        console.log(res.data);
        localStorage.setItem("startLocation", startPoint);
        localStorage.setItem("endLocation", endPoint);
        navigate("/carList");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const price = localStorage.getItem("price");
  const handleApprove = async (userId, driverId) => {
    try {
      await axios
        .put(`http://localhost:8000/api/v1/approve-ride/${userId}`, {
          driverId,
          price,
        })
        .then((result) => {
          console.log(result);
          successToast("Ride request approved successfully");
          setTimeout(() => {
            window.location.replace(result.data.url);
          }, 2000);
        });
    } catch (error) {
      console.error("Error approving ride request:", error.message);
    }
  };
  const handleDecline = async (userId, driverId) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/v1/decline-ride/${userId}`,
        { driverId }
      );
      if (response.data.status === "success") {
        console.log("Ride request declined");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        console.error("Failed to approve ride request:", response.data.message);
      }
    } catch (error) {
      console.error("Error approving ride request:", error.message);
    }
  };

  //for map
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [startingPoint, setStartingPoint] = useState(null);
  const [endingPoint, setEndingPoint] = useState(null);

  useEffect(() => {
    const loadMap = async () => {
      mapboxgl.accessToken =
        "pk.eyJ1IjoiYWhhZGFsaWNob3dkaHVyeSIsImEiOiJjbHNkOW4wZ3owb2huMmlwYzlrMjhtN3JsIn0.osikVK11OS5BL6rK8ZKhYg";

      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [90.4113, 23.8103], // Default center
        zoom: 7,
      });

      setMap(newMap);

      const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: "metric",
        profile: "mapbox/driving",
        controls: {
          // inputs: false,
          // steps: false,
          instructions: false,
          profileSwitcher: false,
        },
      });

      directions.on("route", (event) => {
        if (event.route && event.route[0] && event.route[0].legs) {
          const leg = event.route[0].legs[0];
          setStartingPoint(leg.steps[0].maneuver.location);
          setEndingPoint(leg.steps[leg.steps.length - 1].maneuver.location);
        }
      });

      newMap.addControl(directions, "top-left");
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

  console.log(startPoint);
  console.log(endPoint);

  useEffect(() => {
    if (startingPoint) {
      getAddressFromCoordinates(startingPoint).then((address) => {
        setStartPoint(address);
      });
    }
    if (endingPoint) {
      getAddressFromCoordinates(endingPoint).then((address) => {
        setEndPoint(address);
      });
    }
  }, [startingPoint, endingPoint]);

  if (isVarified) {
    if (accepted) {
      return (
        <>
          <div style={{ height: "100vh" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="modal "
            >
              <div
                style={{
                  width: "500px",
                  borderRadius: "20px",
                  height: "300px",
                }}
                className="box-shadow shadow-lg p-3 mb-5 bg-light"
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      style={{
                        borderRadius: "50%",
                        width: "70px",
                        height: "70px",
                      }}
                      src={userData?.request?.user?.photo}
                      alt=""
                    />
                    <p className="text-dark">
                      Driver Name:{" "}
                      {userData?.request?.user?.firstName +
                        " " +
                        userData?.request?.user?.lastName}
                    </p>
                    <p>Driver Phone No: {userData?.request?.user?.mobile}</p>
                  </div>
                  <div className="d-flex  flex-row mt-4 ms-3 pb-3">
                    <Button
                      variant="primary"
                      className="mx-auto"
                      onClick={() =>
                        handleApprove(
                          userData?._id,
                          userData?.request?.user?._id
                        )
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      variant="primary"
                      className="mx-auto"
                      onClick={() =>
                        handleDecline(
                          userData?._id,
                          userData?.request?.user?._id
                        )
                      }
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return (

        <>
        .
          <div
            className="home-container"
            style={{ flexDirection: "column", marginTop: "0px" }}
          >
            <h2>Find Your Travel Route</h2>
            <p>You can input your location or choose from the map</p>
            <div style={{ display: "flex" }}>
              <div
                style={{ width: "100%", height: "400px" }}
                ref={mapContainer}
              >
                When you think of maps, you likely don’t think much about text.<br/>
                In Lesson One, we defined graphicacy—the skill needed to <br/>
                interpret that which cannot be communicated by text or numbers
                alone—as
              </div>
            </div>
            <button
              className="btn w-40 animated fadeInUp float-end btn-primary mt-5"
              onClick={handleSubmit}
            >
              Next
            </button>
          </div>
        </>
      );
    }
  } else {
    return (
      <>
       <p style={{width: "100%",textAlign: "center", fontSize: "28px", fontWeight: "600", backgroundColor: "#FF5C5C"}}>&#9888; You are Not verifed. Please Varify first</p>
        <div
          className="home-container"
          style={{ flexDirection: "column", marginTop: "100px" }}
        >
          <h2>Find Your Travel Route</h2>
          <p>You can input your location or choose from the map</p>
          <div style={{ display: "flex" }}>
            <div style={{ width: "100%", height: "400px" }} ref={mapContainer}>
              When you think of maps, you likely don’t think much about text. In
              Lesson One, we defined graphicacy—the skill needed to interpret
              that which cannot be communicated by text or numbers alone—as
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Home;
