import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { errorToast, successToast } from "../Helper/FormHelper";
import { Container, Row, Col, Alert } from "react-bootstrap";

function ConfirmRegistrationPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [isVerifying, setisVerifying] = useState(false);
  const verifyEmail = async () => {
    try {
      await axios
        .get(`http://localhost:8000/api/v1/confirm/${code}`)
        .then((res) => {
          setisVerifying(true);
          successToast("email verified successfully");
         
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        });
    } catch (error) {
        errorToast('something is wrong')
        setisVerifying(false);
        
    }
  };

  useEffect(()=>{
    verifyEmail()
  },[])

  return (
    <Container
      fluid
      className="w-full lg:w-1/2 d-flex flex-column items-center justify-content-center px-5"
    >

      {isVerifying ? (
        <Row className="px-14 py-12 max-w-450px d-flex flex-column align-items-center justify-content-center gap-4 rounded-2xl sm-rounded-36px">
          <h4 className="font-normal text-white text-balance text-center sm-text-lg">
            email verification
          </h4>
          <p className="text-center text-balance text-muted italic" style={{fontSize: "34px"}}>
            email verifying
          </p>
        </Row>
      ) : null}

    </Container>
  );
}

export default ConfirmRegistrationPage;
