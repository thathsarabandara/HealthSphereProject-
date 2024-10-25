import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import PatientNavbar from './components/user/PatientNavbar';
import DoctorNavbar from './components/doctor/DoctorNavbar';
import AdminNavbar from './components/admin/AdminPanel'; 
import PatientHome from './pages/User/PatientHome';
import PatientDoctors from './pages/User/PatientDoctors';
import PatientLaboratory from './pages/User/PatientLaboratory';
import PatientPharmacy from './pages/User/PatientPharmacy';
import PatientFooter from './components/user/PatientFooter'; 
import DoctorFooter from './components/doctor/DoctorFooter'; 
import PatientPackages from './pages/User/PatientPackages';
import PatientLogin from './pages/User/PatientLogin';
import PatientRegister from './pages/User/PatientRegister';
import OTPVerification from './pages/User/OTPVerification';
import DoctorLogin from './pages/doctor/DoctorLogin';
import PatientProfile from './pages/User/PatientProfile';


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
        <Route path="/fdoctors" element={<PatientDoctors />} />
        <Route path="/packages" element={<PatientPackages />} />
        <Route path="/laboratory" element={<PatientLaboratory />} />
        <Route path="/pharmacy" element={<PatientPharmacy />} />
        <Route path="/login" element={<PatientLogin />} />
        <Route path="/register" element={<PatientRegister />} />
        <Route path="/verifyuser" element={<OTPVerification />} />
        <Route path="/userprofile" element={<PatientProfile />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
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
