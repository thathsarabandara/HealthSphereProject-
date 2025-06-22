import React, { useState, useEffect } from 'react';
import Rectangle82 from '../../../assets/images/Rectangle 82.svg';
import rectangle90 from '../../../assets/images/Rectangle 90.svg';
import Loader from '../../../components/common/Loader';

function Laboratory() {
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleAddToCart = () => {
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2500);
  };

  useEffect(() => {
    const loadingTimeout = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(loadingTimeout);
  }, []);

  const tests = [
    { name: 'Complete Blood Count (CBC)', image: rectangle90 },
    { name: 'Liver Function Tests (LFT)', image: rectangle90 },
    { name: 'Kidney Function Tests (KFT)', image: rectangle90 },
    { name: 'Thyroid Function Tests (TFT)', image: rectangle90 },
    { name: 'Blood Glucose Levels', image: rectangle90 },
    { name: 'Carcinoembryonic Antigen (CEA)', image: rectangle90 },
  ];

  if (isLoading) {
    return (
      <div style={loaderWrapperStyle}>
        <Loader />
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section style={{ position: 'relative' }}>
        <img src={Rectangle82} alt="Lab" style={{ width: '100%', height: '60vh', objectFit: 'cover' }} />
        <div style={heroTextStyle}>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Health Sphere Labs</h1>
        </div>
      </section>

      {/* Test Listings */}
      <section style={{ background: '#f9fafc', padding: '40px 0' }}>
        <div className="container">
          {tests.map((test, index) => (
            <div key={index} style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <img src={test.image} alt={test.name} style={{ width: 60, height: 60, borderRadius: 8 }} />
                <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{test.name}</h2>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={availableBadgeStyle}>Available</span>
                <button style={bookingButtonStyle} onClick={handleAddToCart}>
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popup */}
      {showPopup && (
        <div style={popupStyle}>
          <h3 style={{ marginBottom: 10 }}>✔️ Added to Cart</h3>
          <button style={popupButtonStyle} onClick={() => alert('Go to cart')}>
            View Cart
          </button>
        </div>
      )}
    </div>
  );
}

/* Inline Styles */
const loaderWrapperStyle = {
  position: 'fixed',
  top: 0, left: 0,
  width: '100vw', height: '100vh',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  backgroundColor: '#f5f7fa',
  zIndex: 1000,
};

const heroTextStyle = {
  position: 'absolute',
  top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  color: '#fff',
  textAlign: 'center',
};

const cardStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '18px 24px',
  borderRadius: 12,
  background: '#fff',
  border: '1px solid #e0e6ed',
  marginBottom: '20px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

const availableBadgeStyle = {
  background: '#e6f9ec',
  color: '#3fa94d',
  padding: '6px 12px',
  borderRadius: 20,
  fontSize: '0.9rem',
  fontWeight: 600,
};

const bookingButtonStyle = {
  backgroundColor: '#1d4ed8',
  color: 'white',
  padding: '8px 16px',
  border: 'none',
  borderRadius: 6,
  fontSize: '0.9rem',
  cursor: 'pointer',
};

const popupStyle = {
  position: 'fixed',
  top: '20%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#fff',
  padding: '24px',
  width: '280px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
  textAlign: 'center',
  zIndex: 1000,
};

const popupButtonStyle = {
  backgroundColor: '#1d4ed8',
  color: 'white',
  padding: '8px 16px',
  border: 'none',
  borderRadius: 6,
  fontSize: '0.9rem',
  cursor: 'pointer',
};

export default Laboratory;
