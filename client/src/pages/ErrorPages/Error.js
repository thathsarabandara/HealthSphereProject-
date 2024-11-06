import React from 'react';
import { Link } from 'react-router-dom';

function Error({ errorimg, errorCode, errorMessage }) {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center" style={{ height: '100vh' }}>
      <div className="row">
        <div style={{ color: '#112D4E', fontSize: 24, fontFamily: 'Sansation', fontWeight: '700', textAlign: 'center', marginBottom: '20px' }}>
          Error Code: {errorCode}
        </div>
      </div>
      <div className="row">
        <img src={errorimg} alt="error" />
      </div>
      <div className="row">
        <div style={{ color: '#112D4E', fontSize: 48, fontFamily: 'Sansation', fontWeight: '700', textAlign: 'center', wordWrap: 'break-word' }}>
          {errorMessage}
        </div>
      </div>
      <div className="row">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <button className="btn mt-1 w-auto d-flex align-items-center justify-content-center" style={{ background: '#C8D8F6', borderRadius: 10 }}>
            <div style={{ color: 'rgba(0, 0, 0, 0.87)', fontSize: 18, fontFamily: 'Sansation', fontWeight: '700', textAlign: 'center', wordWrap: 'break-word' }}>
              Back to home page
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Error;
