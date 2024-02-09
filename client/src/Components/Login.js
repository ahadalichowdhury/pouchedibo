import React, { Fragment, useRef } from "react";
import { Link } from "react-router-dom";
import { isEmpty, isEmailValid, errorToast } from "../Helper/FormHelper";
import { loginRequest } from "../ApiRequest/APIReguest";
import { getMessaging, getToken } from 'firebase/messaging';
import firebase from 'firebase/compat/app';

const firebaseConfig = {
  apiKey: "AIzaSyBY5wEiG4O-e5ss4ISidc2DEJUcCNexVp4",
  authDomain: "testing-realtime-commenting.firebaseapp.com",

  databaseURL: "https://testing-realtime-commenting-default-rtdb.firebaseio.com",

  projectId: "testing-realtime-commenting",

  storageBucket: "testing-realtime-commenting.appspot.com",

  messagingSenderId: "918005772150",

  appId: "1:918005772150:web:c3b4b7f8302e0f21c51457",

  measurementId: "G-3V5JJ7NCBZ"  
};


const app = firebase.initializeApp(firebaseConfig);
const messaging = getMessaging(app);


function Login() {
  let emailRef,
    passwordRef = useRef();

  const submitLogin = async () => {
    let email = emailRef.value;
    let password = passwordRef.value;
    if (isEmailValid(email)) {
      errorToast("Please enter valid email");
    } else if (isEmpty(password)) {
      errorToast("Please enter password");
    } else {
      const fcmToken = getToken(messaging);
      console.log(fcmToken)

      loginRequest(email, password).then((result) => {
        if (result === true) {
          window.location.href = "/";
        }
      });
    }
  };
  return (
    <Fragment>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6 center-screen">
            <div className="card w-90  p-4">
              <div className="card-body">
                <h4>SIGN IN</h4>
                <br />
                <input
                  ref={(input) => (emailRef = input)}
                  placeholder="User Email"
                  className="form-control animated fadeInUp"
                  type="email"
                />
                <br />
                <input
                  ref={(input) => (passwordRef = input)}
                  placeholder="User Password"
                  className="form-control animated fadeInUp"
                  type="password"
                />
                <br />
                <button
                  onClick={submitLogin}
                  className="btn w-100 animated fadeInUp float-end btn-primary"
                >
                  Next
                </button>
                <hr />
                <div className="float-end mt-3">
                  <span>
                    <Link
                      className="text-center ms-3 h6 animated fadeInUp"
                      to="/Registration"
                    >
                      Sign Up{" "}
                    </Link>
                    <span className="ms-1">|</span>
                    <Link
                      className="text-center ms-3 h6 animated fadeInUp"
                      to="/SendOTP"
                    >
                      Forget Password
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Login;
