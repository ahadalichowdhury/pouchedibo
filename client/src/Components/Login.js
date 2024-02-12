import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { isEmpty, isEmailValid, errorToast } from "../Helper/FormHelper";
import { loginRequest } from "../ApiRequest/APIReguest";
import firebase from "firebase/compat/app";
import { getMessaging, getToken } from "firebase/messaging";

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
  const [token, setToken] = useState("");

  useEffect(() => {
    // Request permission for notifications when component mounts
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted.");
      } else {
        console.log("Notification permission denied.");
      }
    });
  }, []);

  let emailRef = useRef(null);
  let passwordRef = useRef(null);

  const submitLogin = async () => {
    try {
      const currentToken = await getToken(messaging, {
        vapidKey: "BO0XkDAL45w0rHe7-fYMIQ4XIhHC_iQiF4w1LZC7DnJPSYOgfG2nyCoiQWrVLjcVtDbRB_SsjbOD9_lS0w34yFM",
      });
      setToken(currentToken);
      console.log(currentToken);

      const email = emailRef.value;
      const password = passwordRef.value;

      if (isEmailValid(email)) {
        errorToast("Please enter a valid email");
      } else if (isEmpty(password)) {
        errorToast("Please enter a password");
      } else {
        try {
          const result = await loginRequest(email, password, currentToken);
          if (result === true) {
            window.location.href = "/";
          }
        } catch (error) {
          console.error('Error logging in:', error);
        }
      }
    } catch (error) {
      console.error('Error getting token:', error);
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
