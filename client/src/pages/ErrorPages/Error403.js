import React from 'react'
import error403 from '../../assets/images/Rectangle 9 (2).svg';
import { Link } from 'react-router-dom';

function Error403() {
  return (
    <div className='container d-flex flex-column align-items-center justify-content-center' style={{ height: '100vh' }}>
      <div className='row'>
        <img src={error403} alt="error404" />
      </div>
      <div className='row'>
        <div style={{ color: '#112D4E', fontSize: 48, fontFamily: 'Sansation', fontWeight: '700', textAlign: 'center', wordWrap: 'break-word' }}>
            Oops! You don’t have permission to access this page.
        </div>
      </div>
      <div className='row'>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <button className="btn mt-1 w-auto d-flex align-items-center justify-content-center" style={{ background: '#C8D8F6', borderRadius: 10 }}>
            <div style={{ color: 'rgba(0, 0, 0, 0.87)', fontSize: 18, fontFamily: 'Sansation', fontWeight: '700', textAlign: 'center', wordWrap: 'break-word' }}>
              Back to home page
            </div>
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Error403