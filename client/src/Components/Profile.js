import React, {useEffect, useRef} from "react";
import {getProfileRequest, updateProfileRequest} from "../ApiRequest/APIReguest";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {getBase64} from "../Helper/sessionHelper";
import {errorToast, isEmailValid, isEmpty, isMobile} from "../Helper/FormHelper";

function Profile() {
    const navigate = useNavigate();

    useEffect(()=>{
        getProfileRequest()
    },[])
    let userImgView, userImgRef, emailRef, firstNameRef, lastNameRef, mobileRef, passwordRef= useRef();
    let ProfileData = useSelector((state)=>state.profile.value)
    //img to get 64 base
    const PreviewImage = (e) => {
        let file = e.target.files[0];
        getBase64(file).then((data)=>{
          userImgView.src = data;
        })
    }

    const updateMyProfile = ()=>{
        let email = emailRef.value;
        let firstName = firstNameRef.value;
        let lastName = lastNameRef.value;
        let mobile = mobileRef.value;
        let password = passwordRef.value;
        let photo = userImgView.src;

        if (isEmailValid(email)) {
            errorToast("Please enter valid email");
        } else if (isEmpty(firstName)) {
            errorToast("Please enter first name");
        } else if (isEmpty(lastName)) {
            errorToast("Please enter last name");
        } else if (isMobile(mobile)) {
            errorToast("Please enter valid mobile number");
        } else if (isEmpty(password)) {
            errorToast("Please enter password");
        } else {
            updateProfileRequest(
                email,
                firstName,
                lastName,
                mobile,
                password, photo
            ).then((result) => {
                if (result === true) {
                    navigate("/");
                }
            });
        }
    }
    return (
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="container-fluid">
                  <img  ref={(input)=>userImgView=input} className="icon-nav-img-lg" src={ProfileData['photo']} alt=""/>
                  <hr/>
                  <div className="row">
                    <div className="col-4 p-2">
                      <label>Profile Picture</label>
                      <input  onChange={PreviewImage} ref={(input)=>userImgRef=input} placeholder="User Email" src={ProfileData['photo']} className="form-control animated fadeInUp" type="file"/>
                    </div>
                    <div className="col-4 p-2">
                      <label>Email Address</label>
                      <input key={Date.now()} defaultValue={ProfileData['email']}  readOnly={true}  ref={(input)=>emailRef=input} placeholder="User Email" className="form-control animated fadeInUp" type="email"/>
                    </div>
                    <div className="col-4 p-2">
                      <label>First Name</label>
                      <input  key={Date.now()} defaultValue={ProfileData['firstName']} ref={(input)=>firstNameRef=input} placeholder="First Name" className="form-control animated fadeInUp" type="text"/>
                    </div>
                    <div className="col-4 p-2">
                      <label>Last Name</label>
                      <input key={Date.now()} defaultValue={ProfileData['lastName']}  ref={(input)=>lastNameRef=input} placeholder="Last Name" className="form-control animated fadeInUp" type="text"/>
                    </div>
                    <div className="col-4 p-2">
                      <label>Mobile</label>
                      <input key={Date.now()} defaultValue={ProfileData['mobile']} ref={(input)=>mobileRef=input} placeholder="Mobile" className="form-control animated fadeInUp" type="mobile"/>
                    </div>
                    <div className="col-4 p-2">
                      <label>Password</label>
                      <input key={Date.now()} defaultValue={ProfileData['password']}  ref={(input)=>passwordRef=input} placeholder="User Password" className="form-control animated fadeInUp" type="password"/>
                    </div>
                    <div className="col-4 p-2">
                      <button onClick={updateMyProfile}  className="btn w-100 float-end btn-primary animated fadeInUp">Update</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Profile;