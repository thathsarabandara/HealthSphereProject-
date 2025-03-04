import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './App.css';
import PatientNavbar from './components/user/PatientNavbar';
import DoctorNavbar from './components/doctor/DoctorNavbar';
//import AdminNavbar from './components/admin/AdminPanel'; 
import PatientHome from './pages/User/PatientHome';
import PatientDoctors from './pages/User/PatientDoctors';
import PatientLaboratory from './pages/User/PatientLaboratory';
import PatientPharmacy from './pages/User/PatientPharmacy';
import PatientAbout from './pages/User/PatientAbout';
import PatientFooter from './components/user/PatientFooter'; 
import DoctorFooter from './components/doctor/DoctorFooter'; 
import PatientPackages from './pages/User/PatientPackages';
import PatientLogin from './pages/User/PatientLogin';
import PatientRegister from './pages/User/PatientRegister';
import OTPVerification from './pages/User/OTPVerification';
import PatientProfile from './pages/User/PatientProfile';
import ResetPassword from './pages/User/ResetPassword';
import PatientPasswordReset from './pages/User/PatientPasswordReset';
import Cart from './pages/User/Cart';
import Payment from './pages/User/Payment';
import PatientPaymentHistory from './pages/User/PatientPaymentHistory';
import PatientPrescriptionHistory from './pages/User/PatientPrescriptionHistory';
import Refund from './pages/User/Refund';
import Error403 from './pages/ErrorPages/Error403';
import Error404 from './pages/ErrorPages/Error404';
import DoctorDetails from './pages/User/DoctorDetails';
import Reservations from './pages/User/Reservations';
import DoctorRegister from './pages/doctor/DoctorRegister';
import DoctorLogin from './pages/doctor/DoctorLogin';
import DoctorAbout from './pages/doctor/DoctorAbout';
import DoctorHome from './pages/doctor/DoctorHome';
import DoctorSchedule from './pages/doctor/DoctorSchedule';
import DoctorVideoConsultation from './pages/doctor/DoctorVideoConsultation';
import DoctorClinic from './pages/doctor/DoctorClinic';
import DoctorPrescription from './pages/doctor/DoctorPrescription';
import DoctorFullRegister from './pages/doctor/DoctorFullRegister';
import DataAccesDenied from './pages/ErrorPages/DataAccesDenied';
import Error400 from './pages/ErrorPages/Error400';
import Error401 from './pages/ErrorPages/Error401';
import Error408 from './pages/ErrorPages/Error408';
import Error429 from './pages/ErrorPages/Error429';
import Error500 from './pages/ErrorPages/Error500';
import Error503 from './pages/ErrorPages/Error503';
import Maintenance from './pages/ErrorPages/Maintenance';
import DoctorsProfile from './pages/User/DoctorsProfile';
import DoctorVerify from './pages/doctor/DoctorVerify';
import WebBot from './components/Web Assistant/WebBot';
import MedicalConditions from './pages/User/MedicalConditions';
import Bookings from './pages/User/Bookings';
import DoctorPatientProfile from './pages/doctor/DoctorPatientProfile';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import AdminPanel from './components/admin/AdminPanel';
import AdminLogin from './pages/admin/Login';

const getNavbarAndFooter = (path) => {
  let NavbarComponent, FooterComponent, SidebarComponent;

  if (path.startsWith('/doctor')) {
    NavbarComponent = DoctorNavbar;
    FooterComponent = DoctorFooter; 
  } else if (path.startsWith('/admin')) {
    //SidebarComponent = AdminPanel; 
    if (path === '/admin/') { 
      SidebarComponent = null
    } else {
      SidebarComponent = AdminPanel; // Show Sidebar for other Admin Pages
    }
  } else {
    NavbarComponent = PatientNavbar; 
    FooterComponent = PatientFooter; 
  }

  return { NavbarComponent, FooterComponent, SidebarComponent };
};

function App() {
  const location = useLocation();
  const { NavbarComponent, FooterComponent, SidebarComponent } = getNavbarAndFooter(location.pathname);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 3000); // Simulate loading time
  }, []);

  return (
    <div>
      {SidebarComponent === null ? (
        <AdminLogin/>
      ) : SidebarComponent ?(  
        <SidebarComponent/> 
      ) : (
        <>
          {NavbarComponent && <NavbarComponent />}
          <Routes>
            <Route path="/" element={<PatientHome />} />
            <Route path="/finddoctors" element={<PatientDoctors />} />
            <Route path="/finddoctors/:category" element={<DoctorDetails />} />
            <Route path="/finddoctors/:category/reservation/:scheduleid" element={<Reservations/>} />
            <Route path="/profileDoctor/:id" element={<DoctorsProfile />} />
            <Route path="/packages" element={<PatientPackages />} />
            <Route path="/laboratory" element={<PatientLaboratory />} />
            <Route path="/pharmacy" element={<PatientPharmacy />} />
            <Route path="/about" element={<PatientAbout/>} />
            <Route path="/medicalcondions" element={<MedicalConditions/>} />
            <Route path="/login" element={<PatientLogin />} />
            <Route path="/register" element={<PatientRegister />} />
            <Route path="/resetpassword" element={<PatientPasswordReset />} />
            <Route path="/verifyuser" element={<OTPVerification />} />
            <Route path="/resetpasswordRequest" element={<ResetPassword />} />
            <Route path="/userprofile" element={<PatientProfile />} />
            <Route path="/paymenthistory" element={<PatientPaymentHistory/>} />
            <Route path="/prescriptionhistory" element={<PatientPrescriptionHistory/>} />
            <Route path="/cart" element={<Cart/>} />
            <Route path="/bookings" element={<Bookings/>} />
            <Route path="/checkout" element={<Payment/>} />
            <Route path="/refund" element={<Refund/>} />
            
            <Route path="/error/accessdenied" element={<DataAccesDenied/>} />
            <Route path="/error/400" element={<Error400/>} />
            <Route path="/error/401" element={<Error401/>} />
            <Route path="/error/403" element={<Error403/>} />
            <Route path="/error/404" element={<Error404/>} />
            <Route path="/error/408" element={<Error408/>} />
            <Route path="/error/429" element={<Error429/>} />
            <Route path="/error/500" element={<Error500/>} />
            <Route path="/error/503" element={<Error503/>} />
            <Route path="/error/maintenance" element={<Maintenance/>} />

            <Route path="/doctor/login" element={<DoctorLogin />} />
            <Route path="/doctor/register" element={<DoctorRegister/>} />
            <Route path="/doctor/patientProfile/:id" element={<DoctorPatientProfile/>} />
            <Route path="/doctor/verifyuser" element={<DoctorVerify/>} />
            <Route path="/doctor/about" element={<DoctorAbout/>} />
            <Route path="/doctor/" element={<DoctorHome/>} />
            <Route path="/doctor/dashboard" element={<DoctorDashboard/>} />
            <Route path="/doctor/schedule" element={<DoctorSchedule/>} />
            <Route path="/doctor/videoconsultation" element={<DoctorVideoConsultation/>} />
            <Route path="/doctor/clinic" element={<DoctorClinic/>} />
            <Route path="/doctor/prescription" element={<DoctorPrescription/>} />
            <Route path="/doctor/fullregister/:id" element={<DoctorFullRegister/>} />

          </Routes>
          <WebBot/>
          {FooterComponent && <FooterComponent />}
        </>
      )}
    </div>    
  );
}

const WrapperApp = () => (
  <Router>
    <App />
  </Router>
);

export default WrapperApp;