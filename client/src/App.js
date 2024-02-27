import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { getToken } from "./Helper/sessionHelper";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import SendOTP from "./pages/SendOTP";
import VerifyOTP from "../src/accountRecover/VerifyOTP";
import CreatePassword from "../src/accountRecover/CreatePassword";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import BecomeDriverPage from "./pages/BecomeDriverPage";
import DriverProfilePage from "./pages/DriverProfilePage";
import UploadDriverInfoPage from "./pages/UploadDriverInfoPage";
import CarListPage from "./pages/carListPage";
import Testing from "./pages/Testing";
import AcceptInvitationPage from "./pages/AcceptInvitationPage";
import SenderWaitingPage from "./pages/SenderWaitingPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import ConfirmRegistrationPage from "./pages/ConfirmRegistrationPage";
function App() {
  if (getToken()) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route exact path="/settings/Profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route exact path="/settings" element={<SettingsPage />} />
          <Route
            exact
            path="/settings/UploadDriverInfo"
            element={<UploadDriverInfoPage />}
          />
          <Route exact path="/carList" element={<CarListPage />} />
          <Route exact path="/settings/Create" element={<BecomeDriverPage />} />
          <Route
            exact
            path="/settings/driver"
            element={<DriverProfilePage />}
          />
          <Route
            exact
            path="/accept-invitation/:userId"
            element={<AcceptInvitationPage />}
          />
          <Route exact path="/senderWaiting" element={<SenderWaitingPage />} />
          <Route exact path="/success" element={<PaymentSuccessPage />} />
        </Routes>
      </BrowserRouter>
    );
  } else {
    return (
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Navigate to="/login" replace />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/Registration" element={<RegistrationPage />} />
          <Route path="/confirm/:code" element={<ConfirmRegistrationPage />} />
          <Route exact path="/SendOTP" element={<SendOTP />} />
          <Route exact path="/VerifyOTP" element={<VerifyOTP />} />
          <Route exact path="/CreatePassword" element={<CreatePassword />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
