import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getBase64 } from "../Helper/sessionHelper";

import "../assets/css/style.css";
import axios from "axios";

function DriverProfile() {
  const [driverData, setDriverData] = useState(null);

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

  return (
    <div className="driver-Profile-Details">
      <div className="container-fluid">
        <div
          className="driverInfo "
          style={{ display: "flex", alignContent: "center", marginTop: "20" }}
        >
          <p>active driver mode</p>
          <div className="toggleBtn">
            <label class="switch">
              <input type="checkbox" />
              <span class="slider round"></span>
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
