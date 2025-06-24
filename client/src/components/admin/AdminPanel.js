import React from 'react';
import { FaTachometerAlt, FaUserMd, FaClipboardList, FaUsers, FaFileInvoiceDollar, FaWarehouse, FaProcedures, FaSignOutAlt } from 'react-icons/fa';
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

function AdminPanel() {
  const sidebarStyle = {
    width: '250px',
    height: '100vh',
    backgroundColor: '#112d4e',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
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

  const contentStyle = {
    marginLeft: '250px',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '20px',
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        {/* Logo */}
        <div style={logoStyle}>
          <img
            src={banner1}
            alt="Health Sphere"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <h2 style={{ fontSize: '1.5rem', marginTop: '10px' }}>Health Sphere</h2>
        </div>

        <hr style={{ borderColor: 'white' }} />

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
          ].map((item, index) => (
            <li key={index}>
              <Link
                to={item.to}
                style={navLinkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2a5d9c')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {item.icon}
                <span style={{ marginLeft: '10px' }}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <hr style={{ borderColor: 'white' }} />

        {/* Logout */}
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <button style={{ width: '100%', backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px' }}>
            <FaSignOutAlt style={{ marginRight: '10px' }} />
            Log Out
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div style={contentStyle}>
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Routes */}
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/doctorsandstaffManagement" element={<DoctorsAndStaffManagement />} />
          <Route path="/admin/appointmentmanagement" element={<AppointmentManagement />} />
          <Route path="/admin/patientmanagement" element={<PatientManagement />} />
          <Route path="/admin/billingandfinancial" element={<BillinAndFinancial />} />
          <Route path="/admin/inventoryandresource" element={<InventoryAndResource />} />
          <Route path="/admin/icu" element={<ICU />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
      
    </div>
  );
}

export default AdminPanel;
