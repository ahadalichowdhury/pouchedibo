class sessionHelper {
  setToken(token) {
    localStorage.setItem("token", token);
  }

  getToken() {
    return localStorage.getItem("token");
  }

  setUserDetails(userDetails) {
    return localStorage.setItem("userDetails", JSON.stringify(userDetails));
  }

  getUserDetails() {
    return JSON.parse(localStorage.getItem("userDetails"));
  }

  removeSessions(){
    localStorage.clear();
    window.location.href = "/Login";
  }

  getBase64(file){
    return new Promise((resolve,reject)=>{
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    })
  }


  setEmail(Email){
    localStorage.setItem("Email", Email);
  }
  getEmail(){
    return localStorage.getItem("Email");
  }

  setOTP(OTP){
    localStorage.setItem("OTP", OTP);
  }
  getOTP(){
    return localStorage.getItem("OTP");
  }
}
export const { setToken,
  getToken,
  removeSessions,
  setUserDetails,
  getUserDetails,
  getBase64,
  setEmail,
  getEmail,
  setOTP,
  getOTP
} = new sessionHelper();
