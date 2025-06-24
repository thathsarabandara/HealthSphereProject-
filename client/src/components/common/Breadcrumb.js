import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Define route labels
  const routeLabels = {
    '': 'Home',
    'doctors': 'Doctors',
    'laboratory': 'Laboratory',
    'pharmacy': 'Pharmacy',
    'about': 'About',
    'packages': 'Packages',
    'login': 'Login',
    'register': 'Register',
    'profile': 'Profile',
    'reset-password': 'Reset Password',
    'password-reset': 'Password Reset',
    'cart': 'Cart',
    'payment': 'Payment',
    'payment-history': 'Payment History',
    'prescription-history': 'Prescription History',
    'refund': 'Refund',
    'reservations': 'Reservations',
    'doctor-details': 'Doctor Details',
    'medical-conditions': 'Medical Conditions',
    'bookings': 'Bookings',
    'prescription-view': 'Prescription View'
  };

  return (
    <nav aria-label="breadcrumb" style={{ marginBottom: '20px' }}>
      <ol className="breadcrumb" style={{ backgroundColor: 'transparent', padding: '8px 0' }}>
        <li className="breadcrumb-item">
          <Link to="/" style={{ textDecoration: 'none', color: '#112D4E' }}>
            Home
          </Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          
          return isLast ? (
            <li key={name} className="breadcrumb-item active" aria-current="page">
              {routeLabels[name] || name.replace(/-/g, ' ').replace(/\w+/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())}
            </li>
          ) : (
            <li key={name} className="breadcrumb-item">
              <Link to={routeTo} style={{ textDecoration: 'none', color: '#112D4E' }}>
                {routeLabels[name] || name.replace(/-/g, ' ').replace(/\w+/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
