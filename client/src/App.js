import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/user/Navbar';
import Home from './pages/User/Home';
import Doctors from './pages/User/Doctors';
import Laboratory from './pages/User/Laboratory';
import Pharmacy from './pages/User/Pharmacy';

import Footer from './components/user/Footer';
import Packages from './pages/User/Packages';
import Login from './pages/User/Login';
import Register from './pages/User/Register';
import OTPVerification from './pages/User/OTPVerification';


function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/doctors" element={<Doctors/>}></Route>
          <Route path="/Packages" element={<Packages/>}></Route>
          <Route path="/Laboratory" element={<Laboratory/>}></Route>
          <Route path="/pharmacy" element={<Pharmacy/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/register" element={<Register/>}></Route>
          <Route path="/verifyuser" element={<OTPVerification/>}></Route>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
