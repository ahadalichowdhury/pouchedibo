import {Fragment, useState} from "react";
import ReactCodeInput from "react-code-input";
import {errorToast} from "../Helper/FormHelper";
import {RecoverVerifyOTPRequest} from "../ApiRequest/APIReguest";
import {getEmail} from "../Helper/sessionHelper";
import {useNavigate} from "react-router-dom";
const VerifyOTP= ()=>{
    let navigate = useNavigate()

    //for react code input package
    let  defaultInputStyle= {
        fontFamily: "monospace",
        MozAppearance: "textfield",
        margin: "4px",
        paddingLeft: "8px",
        width: "45px",
        borderRadius: '3px',
        height: "45px",
        fontSize: "32px",
        border: '1px solid lightskyblue',
        boxSizing: "border-box",
        color: "black",
        backgroundColor: "white",
        borderColor: "lightgrey"
    }


    //state for keep the otp code
    const [otpCode, setOtpCode]=useState("")
    const submitOTP=()=>{
        if(otpCode.length===6) {
            RecoverVerifyOTPRequest(getEmail(), otpCode).then((result) => {
                if(result === true){
                    navigate('/CreatePassword');
                }
            })
        }else{
            errorToast("Enter a valid OTP code")
        }


    }
    return(
        <Fragment>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-7 col-lg-6 center-screen">
                        <div className="card w-90  p-4">
                            <div className="card-body">
                                <h4>OTP VERIFICATION </h4>
                                <p>A 6 Digit verification code has been sent to your email address. </p>
                                <ReactCodeInput onChange={(value)=>setOtpCode(value)} inputStyle={defaultInputStyle}  fields={6}/>
                                <br/>  <br/>
                                <button onClick={submitOTP} className="btn w-100 animated fadeInUp float-end btn-primary">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default VerifyOTP;