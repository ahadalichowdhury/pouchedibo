import { errorToast, successToast } from "../Helper/FormHelper";
import axios from "axios";
import { HideLoader, ShowLoader } from "../Redux/state-slice/settingSlice";
import store from "../Redux/store/store";
import {getToken, setEmail, setOTP, setToken, setUserDetails} from "../Helper/sessionHelper";


import {SetProfile} from "../Redux/state-slice/profileSlice";
//call the gettoken function from sessionhelper.js
const axiosHeader = { headers: { token: getToken() } };

let BaseURL = "http://localhost:8000/api/v1";
export function RegistrationRequest(
  email,
  firstName,
  lastName,
  mobile,
  password,
  photo
) {
  //call start
  store.dispatch(ShowLoader());
  let URL = BaseURL + "/registration";
  let PostBody = {
    email: email,
    firstName: firstName,
    lastName: lastName,
    mobile: mobile,
    password: password,
    photo: photo,
  };
  return axios
    .post(URL, PostBody)
    .then((res) => {
      //call end
      store.dispatch(HideLoader());
      if (res.data["status"] === "fail") {
        if (res.status === 200) {
          if (res.data["data"]["keyPattern"]["email"] === 1) {
            errorToast("Email Already Exist");
            return false;
          } else {
            errorToast("something Went Wrong");
            return false;
          }
        }
      } else {
        successToast("registration successfull");
        return true;
      }
    })
    .catch((err) => {
      //call end
      store.dispatch(HideLoader());
      errorToast("something Went Wrong");
        errorToast(err.message);
      return false;
    });
}
export function loginRequest(email, password) {
  store.dispatch(ShowLoader());
  let URL = BaseURL + "/login";
  let PostBody = {
    email: email,
    password: password,
  };

  return axios
    .post(URL, PostBody)
    .then((res) => {
      store.dispatch(HideLoader());
      if (res.status === 200) {
        setToken(res.data["token"]);
        console.log("this is the res.data",res.data["data"])
        console.log(res.data["data"]);
        setUserDetails(res.data["data"]);
        successToast("Login Successfull");
        return true;
      } else {
        errorToast("invalid email or password");
      }
    })
    .catch((err) => {
      store.dispatch(HideLoader());
      errorToast("something Went Wrong");
      errorToast(err.message);
      return false;
    });
}

export function getProfileRequest(){
    store.dispatch(ShowLoader());
    let URL = BaseURL + "/profileDetails";

    return axios
        .get(URL, axiosHeader)
        .then((res) => {
        store.dispatch(HideLoader());
        if (res.status === 200) {
            store.dispatch(SetProfile(res.data["data"][0]));
        } else {
            errorToast("something Went Wrong");
        }
        })
        .catch((err) => {
        store.dispatch(HideLoader());
        errorToast("something Went Wrong");
        console.error(err);
        });
}
export function updateProfileRequest(email, firstName, lastName, mobile, password, photo){
    store.dispatch(ShowLoader());
    let URL = BaseURL + "/profileUpdate";
    let PostBody = {
        firstName: firstName,
        lastName: lastName,
        mobile: mobile,
        photo: photo,
        email: email,
        password: password
    };
    //for update userDetails for localstorage
    let UserDetails = {
        'firstName': firstName,
        'lastName': lastName,
        'mobile': mobile,
        'photo': photo,
        'email': email
    }

    return axios
        .post(URL, PostBody, axiosHeader)
        .then((res) => {
        store.dispatch(HideLoader());
        if (res.status === 200) {
            successToast("Profile Updated Successfull");
            setUserDetails(UserDetails);
            return true;
        } else {
            errorToast("something Went Wrong");
            return false;
        }
        })
        .catch((err) => {
        store.dispatch(HideLoader());
        errorToast("something Went Wrong");
        console.error(err);
        return false;
        });
}




//recover

//step1: send OTP
export function RecoverVerifyEmailRequest(email){
    store.dispatch(ShowLoader());
    let URL = BaseURL + "/RecoverVerifyEmail/" + email;

    return axios
        .get(URL)
        .then((res) => {
        store.dispatch(HideLoader());
        if (res.status === 200) {
            if(res.data["status"] === "fail"){
                errorToast("No user Found");
                return false;
            }else{
                setEmail(email);
                successToast("A 6 digit OTP Sent Successful to your Email address");
                return true;
            }

        } else {
            errorToast("something Went Wrong");
            return false;
        }
        })
        .catch((err) => {
        store.dispatch(HideLoader());
        errorToast("something Went Wrong");
        console.error(err);
        return false;
        });
}

//step2: verify OTP
export function RecoverVerifyOTPRequest(email, otp){
    store.dispatch(ShowLoader());
    let URL = BaseURL + "/RecoverVerifyOTP/" + email + "/" + otp;

    return axios
        .get(URL)
        .then((res) => {
        store.dispatch(HideLoader());
        if (res.status === 200) {
            if(res.data["status"] === "fail") {
                errorToast("Invalid OTP");
                return false;
            }else{
                setOTP(otp);
                successToast("OTP Verified Successful");
                return true;
            }
        } else {
            errorToast("something Went Wrong");
            return false;
        }
        })
        .catch((err) => {
        store.dispatch(HideLoader());
        errorToast("something Went Wrong");
        console.error(err);
        return false;
        });
}


//step3: update password
export function RecoverResetPasswordRequest(email,OTP,password){
    store.dispatch(ShowLoader());
    let URL = BaseURL + "/RecoverResetPassword";
    let PostBody = {
        email: email,
        OTP: OTP,
        password: password
    };

    return axios
        .post(URL, PostBody)
        .then((res) => {
        store.dispatch(HideLoader());
        if (res.status === 200) {
            if(res.data["status"] === "fail") {
                errorToast("Something is wrong");
                return false;
            }else{
                setOTP(OTP);
                successToast("Password Updated Successful");
                return true;
            }
        } else {
            errorToast("something Went Wrong");
            return false;
        }
        })
        .catch((err) => {
        store.dispatch(HideLoader());
        errorToast("something Went Wrong");
        console.log(err.message);
        return false;
        });
}