import {Fragment, useRef} from "react";
import {errorToast, isEmpty} from "../Helper/FormHelper";
import {RecoverResetPasswordRequest} from "../ApiRequest/APIReguest";
import {getEmail, getOTP} from "../Helper/sessionHelper";
import {useNavigate} from "react-router-dom";
const CreatePassword= ()=>{
    let PasswordRef, ConfirmPasswordRef=useRef()
    let navigate = useNavigate()
    const ResetPassword=()=>{
        let password= PasswordRef.value
        let confirmPassword= ConfirmPasswordRef.value
           if(isEmpty(password)){
               errorToast("Password is required");
            }else if(isEmpty(confirmPassword)){
                errorToast("Confirm Password is required");
            }else if(password!==confirmPassword){
                errorToast("Password and Confirm Password must be same");
            }else{
               RecoverResetPasswordRequest(getEmail(),getOTP(), password).then((result)=>{
                   if(result === true){
                       navigate("/Login")
                   }
               })
           }
    }
    return(
        <Fragment>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-7 col-lg-6 center-screen">
                        <div className="card w-90 p-4">
                            <div className="card-body">
                                <h4>SET NEW PASSWORD</h4>
                                <br/>
                                <label>Your email address</label>
                                <input readOnly={true} value={getEmail()}  placeholder="User Email" className="form-control animated fadeInUp" type="email"/>
                                <br/>
                                <label>New Password</label>
                                <input  ref={(input)=>PasswordRef=input} placeholder="New Password" className="form-control animated fadeInUp" type="password"/>
                                <br/>
                                <label>Confirm Password</label>
                                <input  ref={(input)=>ConfirmPasswordRef=input} placeholder="Confirm Password" className="form-control animated fadeInUp" type="password"/>
                                <br/>
                                <button onClick={ResetPassword} className="btn w-100 animated fadeInUp float-end btn-primary">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}


export default CreatePassword;