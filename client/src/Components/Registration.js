import React, { useRef } from "react";
import {
  errorToast,
  isEmailValid,
  isEmpty,
  isMobile,
  isPasswordValid
} from "../Helper/FormHelper";
import { RegistrationRequest } from "../ApiRequest/APIReguest";
import { NavLink, useNavigate } from "react-router-dom";
function Registration() {
  let navigate = useNavigate();
  let emailRef,
    firstNameRef,
    lastNameRef,
    mobileRef,
    passwordRef = useRef();

  const onRegistration = () => {
    let email = emailRef.value;
    let firstName = firstNameRef.value;
    let lastName = lastNameRef.value;
    let mobile = mobileRef.value;
    let password = passwordRef.value;
    // console.log(password)
    // return;
    let photo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwAQAAAAB/ecQqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADWAAAA1gAe5jgMoAAAAHdElNRQfnAhEOCziUmK5fAAAADUlEQVQY02NgGAXUBAABUAABp+LaFgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wMi0xN1QxNDoxMTo1NiswMDowMGPF+jUAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDItMTdUMTQ6MTE6NTYrMDA6MDASmEKJAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg=="

    if (isEmailValid(email)) {
      errorToast("Please enter valid email");
    } else if (isEmpty(firstName)) {
      errorToast("Please enter first name");
    } else if (isEmpty(lastName)) {
      errorToast("Please enter last name");
    } else if (isMobile(mobile)) {
      errorToast("Please enter valid mobile number");
    } else if(isPasswordValid(password)) {
      errorToast("Please enter atleast 1 digit, one letter and will password will be 8 characters long");
    } else {
      RegistrationRequest(
        email,
        firstName,
        lastName,
        mobile,
        password, photo
      ).then((result) => {
        if (result === true) {
          navigate("/Login");
        }
      }).catch((err)=>{
        errorToast(err.message)
      })
    }
  };

  return (
    <div className="container">
      <div className="row  justify-content-center">
        <div className="col-md-10 col-lg-8 center-screen">
          <div className="card animated fadeIn w-100 p-3">
            <div className="card-body">
              <h4>Sign Up</h4>
              <hr />
              <div className="container-fluid m-0 p-0">
                <div className="row m-0 p-0">
                  <div className="col-lg-12 col-md-4 p-2">
                    <label>Email Address</label>
                    <input
                      ref={(input) => (emailRef = input)}
                      placeholder="User Email"
                      className="form-control animated fadeInUp"
                      type="email"
                    />
                  </div>
                  
                  <div className="col-lg-12 col-md-4 p-2">
                    <label>First Name</label>
                    <input
                      ref={(input) => (firstNameRef = input)}
                      placeholder="First Name"
                      className="form-control animated fadeInUp"
                      type="text"
                    />
                
                  </div>
                  <div className="col-lg-12 col-md-4 p-2">
                    <label>Last Name</label>
                    <input
                      ref={(input) => (lastNameRef = input)}
                      placeholder="Last Name"
                      className="form-control animated fadeInUp"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-12 col-md-4 p-2">
                    <label>Mobile Number</label>
                    <input
                      ref={(input) => (mobileRef = input)}
                      placeholder="Mobile"
                      className="form-control animated fadeInUp"
                      type="mobile"
                    />
                  </div>
                  <div className="col-lg-12 col-md-4 p-2">
                    <label>Password</label>
                    <input
                      ref={(input) => (passwordRef = input)}
                      placeholder="User Password"
                      className="form-control animated fadeInUp"
                      type="password"
                    />
                  </div>
                </div>
                <div lassName="row mt-2 p-0">
                  <div className="col-lg-12 col-md-4 p-2">
                    <button
                      onClick={onRegistration}
                      className="btn mt-3 w-100 float-end btn-primary animated fadeInUp"
                    >
                      Complete
                    </button>
                  </div>
                </div>
                <p className="text-center">already have an account? <NavLink to="/login"><span className="font-weight-bold">login</span></NavLink></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registration;
