import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import PatientNavbar from './components/user/PatientNavbar';
import DoctorNavbar from './components/doctor/DoctorNavbar';
import AdminNavbar from './components/admin/AdminPanel'; 
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


const getNavbarAndFooter = (path) => {
  let NavbarComponent, FooterComponent;

  if (path.startsWith('/doctor')) {
    NavbarComponent = DoctorNavbar;
    FooterComponent = DoctorFooter; 
  } else if (path.startsWith('/admin')) {
    NavbarComponent = AdminNavbar;
  } else {
    NavbarComponent = PatientNavbar; 
    FooterComponent = PatientFooter; 
  }

  return { NavbarComponent, FooterComponent };
};

function App() {
  const location = useLocation();
  const { NavbarComponent, FooterComponent } = getNavbarAndFooter(location.pathname);

  return (
    <div>
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<PatientHome />} />
        <Route path="/finddoctors" element={<PatientDoctors />} />
        <Route path="/finddoctors/:category" element={<DoctorDetails />} />
        <Route path="/packages" element={<PatientPackages />} />
        <Route path="/laboratory" element={<PatientLaboratory />} />
        <Route path="/pharmacy" element={<PatientPharmacy />} />
        <Route path="/about" element={<PatientAbout/>} />
        <Route path="/login" element={<PatientLogin />} />
        <Route path="/register" element={<PatientRegister />} />
        <Route path="/resetpassword" element={<PatientPasswordReset />} />
        <Route path="/verifyuser" element={<OTPVerification />} />
        <Route path="/resetpasswordRequest" element={<ResetPassword />} />
        <Route path="/userprofile" element={<PatientProfile />} />
        <Route path="/paymenthistory" element={<PatientPaymentHistory/>} />
        <Route path="/prescriptionhistory" element={<PatientPrescriptionHistory/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/payment" element={<Payment/>} />
        <Route path="/refund" element={<Refund/>} />
        <Route path="/reservations" element={<Reservations/>} />

        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/register" element={<DoctorRegister/>} />
        <Route path="/doctor/about" element={<DoctorAbout/>} />
        <Route path="/doctor/home" element={<DoctorHome/>} />

        <Route path="/error403" element={<Error403/>} />
        <Route path="/error404" element={<Error404/>} />
        {/* Add more routes as necessary */}
      </Routes>
      <FooterComponent />
    </div>
  );
}

const WrapperApp = () => (
  <Router>
    <App />
  </Router>
);

export default WrapperApp;
