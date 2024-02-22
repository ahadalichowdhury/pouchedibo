import React, { useEffect, useRef, useState } from "react";
import "../assets/css/style.css";
import axios from "axios";
import { errorToast, successToast } from "../Helper/FormHelper";
import { Button } from "react-bootstrap";

function Home() {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const fromRef = useRef();
  const toRef = useRef();
  const dateRef = useRef();
  const startTimeRef = useRef();
  const endTimeRef = useRef();

  const token = localStorage.getItem("token");
  const [userData, setUserData]= useState(null)
  const [accepted, isAccepted]= useState(null)
  console.log("user data",userData)
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

          });
      } catch (error) {
        errorToast(error.message);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = () => {
    const from = fromRef.current.value;
    const to = toRef.current.value;
    const date = dateRef.current.value;

    // console.log(from, to, date, startTime, endTime);

    const token = localStorage.getItem("token");

    axios
      .post(
        `http://localhost:8000/api/v1/createHistory`,
        {
          from,
          to,
          date,
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
        localStorage.setItem("startLocation", from);
        localStorage.setItem("endLocation", to);
        window.location.href = "/carList";
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const handleApprove = async (userId, driverId) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/v1/approve-ride/${userId}`, { driverId });
      if (response.data.status === 'success') {
        successToast('Ride request approved successfully');
        setTimeout(() => {
          window.location.href = "/"
        }, 2000);
      } else {
        console.error('Failed to approve ride request:', response.data.message);
      }
    } catch (error) {
      console.error('Error approving ride request:', error.message);
    }
  };
  const handleDecline = async (userId, driverId) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/v1/decline-ride/${userId}`, { driverId });
      if (response.data.status === 'success') {
        console.log('Ride request declined');
        setTimeout(() => {
          window.location.href = "/"
        }, 2000);
      } else {
        console.error('Failed to approve ride request:', response.data.message);
      }
    } catch (error) {
      console.error('Error approving ride request:', error.message);
    }
  };
  return (
    accepted ? (
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
            style={{ width: "500px", borderRadius: "20px", height: "300px" }}
            className="box-shadow shadow-lg p-3 mb-5 bg-light"
          >
            <div>
              <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <img style={{borderRadius: "50%", width: "70px", height: "70px"}} src={userData?.request?.user?.photo} alt=""/>
                <p className="text-dark">Driver Name: {userData?.request?.user?.firstName +" " + userData?.request?.user?.lastName }</p>
                <p>Driver Phone No: {userData?.request?.user?.mobile }</p>
              </div>
              <div className="d-flex  flex-row mt-4 ms-3 pb-3">
                <Button
                  variant="primary"
                  className="mx-auto"
                  onClick={()=>handleApprove(userData?._id, userData?.request?.user?._id)}
                >
                  Approve
                </Button>
                <Button
                  variant="primary"
                  className="mx-auto"
                  onClick={()=>handleDecline(userData?._id, userData?.request?.user?._id)}
                >
                  Cancel
                </Button>
                
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    ) : (
      <div className="home-container">
        <div className="input-form">
          <h2>Search location</h2>
          <input
            type="text"
            className="homeinput"
            placeholder="From"
            ref={fromRef}
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
          />
          <input
            type="text"
            className="homeinput"
            placeholder="To"
            ref={toRef}
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
          />
          <input
            type="date"
            className="homeinput"
            placeholder="estimated date"
            ref={dateRef}
          />
          <button
            className="btn w-100 animated fadeInUp float-end btn-primary"
            onClick={handleSubmit}
          >
            Search
          </button>
        </div>
        <div className="google-map">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/d/embed?mid=12Gwhw81QpfUErMIYE8fl5tQNqZs&hl=en&ehbc=2E312F"
            width="400"
            height="300"
          ></iframe>
        </div>
      </div>
    )
  );
  
}

export default Home;
