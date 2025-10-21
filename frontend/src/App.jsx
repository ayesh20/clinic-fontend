import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { Toaster } from "react-hot-toast";

// Pages
import Home from "./pages/Home/Home";
import Doctors from "./pages/Doctors/Doctors";
import ContactUs from "./pages/ContactUs/Contactus";
import Register from "./pages/Signup/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import OTPVerification from "./pages/OTPVerification/OTPVerification";
import ResetConfirm from "./pages/ResetConfirm/ResetConfirm";
import SetNewPassword from "./pages/SetNewPassword/SetNewPassword";
import SuccessfulReset from "./pages/SuccessfulReset/SuccessfulReset";
import Appointment from "./pages/Appoinment/Appoinment.jsx";
import PatientManagement from "./pages/PatientManagement/PatientManagement.jsx";
import DoctorProfile from "./pages/DoctorProfile/doctorProfile.jsx";
import AdminLayout from "./pages/admin/adminpage.jsx";
import AppointmentDetails from "./pages/AppointmentDetails/AppointmentDetails.jsx";

// ✅ Missing import added
import ViewAppointments from "./pages/ViewAppointments/ViewAppointments.jsx"; 

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
          style: { background: "#363636", color: "#fff" },
          success: {
            duration: 3000,
            iconTheme: { primary: "#4ade80", secondary: "#fff" },
          },
          error: {
            duration: 4000,
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
        }}
      />

      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/admin/*" element={<AdminLayout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/otpverification" element={<OTPVerification />} />
            <Route path="/resetconfirm" element={<ResetConfirm />} />
            <Route path="/setnewpassword" element={<SetNewPassword />} />
            <Route path="/successfulreset" element={<SuccessfulReset />} />
            <Route path="/doctorprofile" element={<DoctorProfile />} />

            {/* Protected Routes */}
            <Route
              path="/appointment"
              element={
                <PrivateRoute>
                  <Appointment />
                </PrivateRoute>
              }
            />

            <Route
              path="/patientmanagement"
              element={
                <PrivateRoute>
                  <PatientManagement />
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

            <Route
              path="/appointmentdetails"
              element={
                <PrivateRoute>
                  <AppointmentDetails />
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
