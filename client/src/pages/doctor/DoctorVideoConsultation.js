import React, { useState } from 'react';
import { FaTools } from 'react-icons/fa';
import Loader from '../../components/common/Loader';

const DoctorVideoConsultation = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading
  setTimeout(() => {
    setLoading(false);
  }, 1000);

  if (loading) {
    return <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f4f8',
      zIndex: 9999
    }}>
      <Loader />
    </div>
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="text-center">
        <FaTools size={64} className="text-primary mb-4" />
        <h2 className="mb-3">Page Under Construction</h2>
        <p className="text-muted">We're working on something awesome. Please check back soon!</p>
      </div>
    </div>
  );
};

export default DoctorVideoConsultation;
