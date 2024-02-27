import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { successToast } from "../Helper/FormHelper";

function AcceptInvitationPage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [isAccepted, setIsAccepted] = useState(null);
  console.log("is accepted", isAccepted);
  useEffect(() => {
    axios.get(`http://localhost:8000/api/v1/userInfo/${userId}`).then((res) => {
      setIsAccepted(res?.data?.data?.request?.isAccepted);
      console.log(res?.data?.data);
    });
  }, []);
  const token = localStorage.getItem('token');
  const handleOnClick = async () => {
    try {
      await axios.put(`http://localhost:8000/api/v1/acceptUser/${userId}`, {
        isAccepted: true,
      },{
        headers: {
          token: `${token}`, // Include the token in the Authorization header
        },
      }).then((res)=>{
        successToast("You are accepted this ride")
        setTimeout(() => {
          navigate("/");
      }, 2000);
      })
    } catch (error) {
      console.log(error.message)
    }
  };
  return (
    <div>
      {isAccepted ? (
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
            className="box-shadow shadow-lg p-3 mb-5 bg-light d-flex justify-content-center align-items-center"
          >
            <div>
              <div>
                <h4 className="text-dark text-center h-3">Other Driver accepted this ride, Good Luck For next time</h4>
              </div>
              <div className="d-flex  flex-row mt-4 ms-3 pb-3">
                <Button
                  variant="primary"
                  className="mx-auto"
                  onClick={()=> navigate("/")}
                >
                  Go back HomePage
                </Button>
                
              </div>
            </div>
          </div>
        </div>
      </div>
      ) : (
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
              className="box-shadow shadow-lg p-3 mb-5 bg-light d-flex justify-content-center align-items-center"
            >
              <div>
                <div>
                  <h4 className="text-dark text-center h-3">Are you sure to confirm this ride?</h4>
                </div>
                <div className="d-flex  flex-row mt-4 ms-3 pb-3">
                  <Button
                    variant="primary"
                    className="me-3"
                    onClick={handleOnClick}
                  >
                    Yes
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => (navigate("/"))}
                    className="me-3"
                  >
                    No
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AcceptInvitationPage;
