import React, { useState } from 'react';
import { FaTachometerAlt, FaUserMd, FaClipboardList, FaUsers, FaFileInvoiceDollar, FaWarehouse, FaProcedures, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { Link, Routes, Route} from 'react-router-dom';
import DoctorsAndStaffManagement from '../../pages/admin/DoctorsAndStaffManagement';
import AdminDashboard from '../../pages/admin/AdminDashboard';
import AppointmentManagement from '../../pages/admin/AppointmentManagement';
import banner1 from '../../assets/images/banner-img.png';
import PatientManagement from '../../pages/admin/PatientManagement';
import BillinAndFinancial from '../../pages/admin/BillingAndFinancialManagement';
import InventoryAndResource from '../../pages/admin/InventoryAndResourcesManagement';
import ICU from '../../pages/admin/IntensiveCareUnit';
import DoctorRequestPage from '../../pages/admin/DoctorRequstPage'
import AdminDoctorProfilePage from '../../pages/admin/AdminDoctorProfilePage'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminManagement from '../../pages/admin/AdminManagement';
import ReportGeneration from '../../pages/admin/ReportGeneration';

function AdminPanel() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:5000/admin/logout', {}, { withCredentials: true });
      if (response.status === 200) {
        console.log('Logout successful:', response.data.message);
        navigate('/admin/login');
      }
    } catch (error) {
      console.error('Logout error:', error.response ? error.response.data : error.message);
    }
  };

  const sidebarStyle = {
    width: isExpanded ? '250px' : '50px',
    height: '100vh',
    backgroundColor: '#112d4e',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
    transition: 'width 0.3s',
    flexShrink: 0,
    overflow: 'hidden'
  };

  const navLinkStyle = {
    color: 'white',
    margin: '5px 0',
    padding: '10px',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '4px',
    transition: '0.3s',
  };

  const navLinkHoverStyle = {
    backgroundColor: '#2a5d9c',
  };

  const logoStyle = {
    textAlign: 'center',
    padding: '20px',
  };

  const mainContentStyle = {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: '20px',
    overflowY: 'auto',
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        {/* Burger Button at top-left */}
        <button 
          onClick={toggleSidebar}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'white', 
            fontSize: '1.5rem',
            alignSelf: 'flex-start',
            marginBottom: '20px'
          }}
        >
          <FaBars />
        </button>

        {/* Logo - only shown when expanded */}
        {isExpanded && (
          <div style={logoStyle}>
            <img
              src={banner1}
              alt="Health Sphere"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            <h2 style={{ fontSize: '1.5rem', marginTop: '10px' }}>Health Sphere</h2>
          </div>
        )}

        <hr style={{ borderColor: 'white', display: isExpanded ? 'block' : 'none' }} />

        {/* Navigation Items */}
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            { to: '/admin', label: 'Dashboard', icon: <FaTachometerAlt /> },
            { to: '/admin/doctorsandstaffManagement', label: 'Doctors and Staff Management', icon: <FaUserMd /> },
            { to: '/admin/appointmentmanagement', label: 'Appointment Management', icon: <FaClipboardList /> },
            { to: '/admin/patientmanagement', label: 'Patient Management', icon: <FaUsers /> },
            { to: '/admin/billingandfinancial', label: 'Billing & Financial Management', icon: <FaFileInvoiceDollar /> },
            { to: '/admin/inventoryandresource', label: 'Inventory & Resources Management', icon: <FaWarehouse /> },
            { to: '/admin/icu', label: 'Intensive Care Unit', icon: <FaProcedures /> },
            { to: '/admin/management', label: 'Admin Management', icon: <FaUserMd /> },
            { to: '/admin/reportgeneration', label: 'Report Generation', icon: <FaFileInvoiceDollar /> },
          ].map((item, index) => (
            <li key={index}>
              <Link
                to={item.to}
                style={navLinkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2a5d9c')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {item.icon}
                {isExpanded && <span style={{ marginLeft: '10px' }}>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>

        <hr style={{ borderColor: 'white', display: isExpanded ? 'block' : 'none' }} />

        {/* Logout - only shown when expanded */}
        {isExpanded && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <button style={{ width: '100%', backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px' }} onClick={handleLogout}>
              <FaSignOutAlt style={{ marginRight: '10px' }} />
              Log Out
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/doctorsandstaffManagement" element={<DoctorsAndStaffManagement />} />
          <Route path="/admin/appointmentmanagement" element={<AppointmentManagement />} />
          <Route path="/admin/patientmanagement" element={<PatientManagement />} />
          <Route path="/admin/billingandfinancial" element={<BillinAndFinancial />} />
          <Route path="/admin/inventoryandresource" element={<InventoryAndResource />} />
          <Route path="/admin/icu" element={<ICU />} />
          <Route path="/admin/doctorrequests" element={<DoctorRequestPage />} />
          <Route path="/admin/doctor/:doctorId" element={<AdminDoctorProfilePage />} />
          <Route path="/admin/management" element={<AdminManagement />} />
          <Route path="/admin/reportgeneration" element={<ReportGeneration />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
      
    </div>
  );
}

export default AdminPanel;
