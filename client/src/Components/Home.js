import React, { useRef, useState } from "react";
import "../assets/css/style.css";
import axios from "axios";

function Home() {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const fromRef = useRef();
  const toRef = useRef();
  const dateRef = useRef();
  const startTimeRef = useRef();
  const endTimeRef = useRef();

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

  return (
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
  );
}

export default Home;
