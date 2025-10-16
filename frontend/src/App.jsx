import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx"; // Ensure path is correct
import { Toaster } from 'react-hot-toast';

import Home from './pages/Home/Home';
import Doctors from './pages/Doctors/Doctors';
import ContactUs from './pages/ContactUs/Contactus';
import Register from "./pages/Signup/Signup.jsx";
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import OTPVerification from './pages/OTPVerification/OTPVerification';
import ResetConfirm from './pages/ResetConfirm/ResetConfirm';
import SetNewPassword from './pages/SetNewPassword/SetNewPassword';
import SuccessfulReset from './pages/SuccessfulReset/SuccessfulReset';
import Appointment from "./pages/Appoinment/Appoinment.jsx";
import PatientManagement from "./pages/PatientManagement/PatientManagement.jsx";
import DoctorProfile from "./pages/DoctorProfile/doctorProfile.jsx";
import AdminLayout from "./pages/admin/adminpage.jsx"


import AppointmentDetails from "./pages/AppointmentDetails/AppointmentDetails.jsx";

// PrivateRoute wrapper
function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <Navigate to="/" />;

  return children;
}

function App() {
  return (
    <>
     <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/Doctors" element={<Doctors />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/admin/*" element={<AdminLayout/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/OTPVerification" element={<OTPVerification />} />
          <Route path="/ResetConfirm" element={<ResetConfirm />} />
          <Route path="/SetNewPassword" element={<SetNewPassword />} />
          <Route path="/SuccessfulReset" element={<SuccessfulReset />} />
          <Route path="/PatientManagement" element={<PatientManagement />} />
          <Route path="/doctorProfile" element={<DoctorProfile />} />

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

          <Route
            path="/viewappointment"
            element={
              <PrivateRoute>
                <ViewAppointments />
              </PrivateRoute>
            }
          />
         
         
         
         </Routes>
      </BrowserRouter>
    </AuthProvider>
    </>
  );
}

export default App;
