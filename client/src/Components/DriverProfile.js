import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getBase64 } from "../Helper/sessionHelper";

import "../assets/css/style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DriverProfile() {
  const [driverData, setDriverData] = useState(null);
  console.log("driver profile loaded", driverData?.driver_mode)
  const navigate = useNavigate();

  // console.log("user data", userData);

  useEffect(() => {
    // Function to fetch user data
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/getProfile",
          {
            headers: {
              token: `${token}`,
            },
          }
        );

        // Set userData state with the received data
        setDriverData(response.data.data.Driver);
        console.log(response.data.data.Driver);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Call fetchUserData function when the component mounts
    fetchUserData();
  }, []);

  let userImgView,
    userImgRef,
    emailRef,
    firstNameRef,
    lastNameRef,
    mobileRef,
    passwordRef = useRef();
  let ProfileData = useSelector((state) => state.profile.value);

  const PreviewImage = (e) => {
    let file = e.target.files[0];
    getBase64(file).then((data) => {
      userImgView.src = data;
    });
  };

  //for toggle
  const toggleRef = useRef(null);

  const handleToggleChange = async () => {
    const newValue = toggleRef.current.checked;
    console.log("New toggle value:", newValue);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:8000/api/v1/driver-mode",
        {
          newMode: newValue,
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
        }
      ).then(res=>{
        window.location.href="/settings/driver";
      })

      console.log("Toggle update response:", response.data);
      // Handle response if needed
    } catch (error) {
      console.error("Error updating toggle:", error);
      // Handle error if needed
    }
  };

  return (
    <div className="driver-Profile-Details">
      <div className="container-fluid">
        <div
          className="driverInfo "
          style={{ display: "flex", alignContent: "center", marginTop: "20" }}
        >
          <p>active driver mode</p>
          <div className="toggleBtn">
            <label className="switch">
              <input
                type="checkbox"
                ref={toggleRef}
                checked={driverData?.driver_mode}
                onChange={handleToggleChange}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        <div className="profile-details">
          <h5>Name : {driverData?.holderName}</h5>
          <p>Address : {driverData?.address}</p>
          <p>Gender : {driverData?.gender}</p>
          <p>NID : {driverData?.NID}</p>
          <h5>Car Identity</h5>
          <p>License Number : {driverData?.licenceNumber}</p>
          <p>Vehicle Type : {driverData?.vehicleType?.vehicleName}</p>
          {/* <p>Plate Number:</p> */}
          <h5>Vehicle Image</h5>

          <div className="row">
            {driverData?.vehicleImage?.map((image, index) => (
              <div key={index} className="col-2 p-2">
                {" "}
                {/* Adjust the column size based on your layout */}
                <img
                  src={image}
                  alt={`Vehicle Image ${index}`}
                  className="img-fluid"
                  style={{ height: "240px", width: "240px" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverProfile;
