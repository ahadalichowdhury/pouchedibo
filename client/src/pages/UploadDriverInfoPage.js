import React, { useEffect, useRef, useState } from "react";
import "./UploadDriverInfoPage.css";
import { NavLink, useNavigate } from "react-router-dom";
import { successToast } from "../Helper/FormHelper";
import axios from "axios";
import { getUserDetails, removeSessions } from "../Helper/sessionHelper";

function UploadDriverInfoPage() {
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch vehicles from the backend when the component mounts
    async function fetchVehicles() {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/vehicles"
        );
        setVehicles(response.data.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    }

    fetchVehicles();
  }, []);
  let holderNameRef,
    addressRef,
    NIDRef,
    vehicleNameRef,
    vehiclePlateRef,
    licenceNoRef,
    genderRef = useRef();

  const [uploadURL, setUploadURL] = useState([]);
  console.log("upload image url as an array", uploadURL);
  const handleChange = (e) => {
    const files = e.target.files;
    if (files.length) {
      uploadFile(files[0]);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.status === "success") {
        successToast("File uploaded successfully!");
        const uploadedUrl = response.data.uploadedUrl;
        setUploadURL([...uploadURL, uploadedUrl]);
      }
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  
const token = localStorage.getItem("token");
 const handleSubmit = async () => {
  let holderName = holderNameRef.value;
  let address = addressRef.value;
  let Nid = NIDRef.value;
  let vehicleNameId = vehicleNameRef.value;
  let vehiclePlate = vehiclePlateRef.value;
  let licenceNo = licenceNoRef.value;
  let gender = genderRef.value;
  const formData = {
    holderName: holderName,
    address,
    NID: Nid,
    vehicleType: vehicleNameId,
    vehiclePlate,
    licenceNumber:licenceNo,
    gender,
    vehicleImage: uploadURL
  };

  try {
    // Send the POST request to the backend
    const response = await axios.post(
      'http://localhost:8000/api/v1/createDriverProfile',
      formData,
      {
        headers: {
          'token': `${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Response:', response.data);
    removeSessions()
    navigate("/");
  } catch (error) {
    console.error('Error creating driver profile:', error);
  }
};
  return (
    <div className="Big_container">
      <header>Driver Information</header>
      <form action="#">
        <div className="form_first">
          <div className="details personal">
            <span className="title_name">Owner Identity</span>
            <div className="fields_name">
              <div className="input_field">
                <label>Holder name</label>
                <input
                  type="text"
                  placeholder="Enter your Name"
                  required
                  ref={(input) => (holderNameRef = input)}
                />
              </div>

              <div className="input_field">
                <label>Address</label>
                <input
                  type="text"
                  placeholder="Enter your Address"
                  required
                  ref={(input) => (addressRef = input)}
                />
              </div>

              <div className="input_field">
                <label>Gender</label>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      ref={(input) => (genderRef = input)}
                      required
                    />
                    Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      required
                      ref={(input) => (genderRef = input)}
                    />
                    Female
                  </label>
                </div>
              </div>

              <div className="input_field">
                <label>Nid</label>
                <input
                  type="number"
                  placeholder="Enter your Nid"
                  required
                  ref={(input) => (NIDRef = input)}
                />
              </div>
            </div>
          </div>
          <div className="details ID">
            <span className="title_name">Car Identity</span>
            <div className="fields_name">
              <div className="input_field">
                <label>Licence Number</label>
                <input
                  type="text"
                  placeholder="Driving licence"
                  required
                  ref={(input) => (licenceNoRef = input)}
                />
              </div>

              <div className="input_field">
                <label>Vehicle Type</label>
                <select
                  ref={(select) => (vehicleNameRef = select)}
                  className="form-control"
                  required
                >
                  <option value="">Select Vehicle</option>
                  {/* Populate options dynamically */}
                  {vehicles.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicle.vehicleName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input_field">
                <label>vehicle Plate Number</label>
                <input
                  type="text"
                  placeholder="Enter Plate Number"
                  required
                  ref={(input) => (vehiclePlateRef = input)}
                />
              </div>

              <div className="input_field">
                <label>Add vehicle Image</label>
                <span>car front</span>
                <input
                  type="file"
                  placeholder="Enter your Number"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="input_field">
                <span>car left side</span>
                <input
                  type="file"
                  placeholder="Enter your Gender"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="input_field">
                <span>car right side</span>
                <input
                  type="file"
                  placeholder="Enter your Occupation"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <NavLink >
              <button className="next_Btn" onClick={handleSubmit}>
                <span className="btn_Text">Submit</span>
              </button>
            </NavLink>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UploadDriverInfoPage;
