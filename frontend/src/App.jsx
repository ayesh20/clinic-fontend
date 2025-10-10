import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx"; // Ensure path is correct


import Home from './pages/Home/Home';
import Doctors from './pages/Doctors/Doctors';
import ContactUs from './pages/ContactUs/Contactus';


import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import OTPVerification from './pages/OTPVerification/OTPVerification';
import ResetConfirm from './pages/ResetConfirm/ResetConfirm';
import SetNewPassword from './pages/SetNewPassword/SetNewPassword';
import SuccessfulReset from './pages/SuccessfulReset/SuccessfulReset';
import Appointment from "./pages/Appoinment/Appoinment.jsx";
import PatientManagement from "./pages/PatientManagement/PatientManagement.jsx";


// PrivateRoute wrapper
function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <Navigate to="/" />;

  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
        
        
          <Route path="/" element={<Home />} />
                    <Route path="/Doctors" element={<Doctors />} />
                    <Route path="/ContactUs" element={<ContactUs />} />


          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/OTPVerification" element={<OTPVerification />} />
          <Route path="/ResetConfirm" element={<ResetConfirm />} />
          <Route path="/SetNewPassword" element={<SetNewPassword />} />
          <Route path="/SuccessfulReset" element={<SuccessfulReset />} />
          <Route path="/PatientManagement" element={<PatientManagement />} />

          {/* Protected routes */}
          
       
         
         
         
         
          <Route
            path="/appointment"
            element={
              <PrivateRoute>
                <Appointment />
              </PrivateRoute>
            }
          />

          <Route
            path="/PatientManagement"
            element={
              <PrivateRoute>
                <Appointment />
              </PrivateRoute>
            }
          />
         
         
        
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;