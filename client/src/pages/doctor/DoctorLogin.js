import React from 'react';
import { Link } from 'react-router-dom';
import signin from '../../assets/images/Rectangle 84 (1).svg'

function App() {
  return (
    <div className="container p-3 my-5 h-custom">
      <div className="row g-0" style={{background: '#C8D8F6', borderRadius: 12}}>
        <div className='col-md-1'/>
        <div className="col-md-5 no-gap" >
          <img
            src={signin}
            className="img-fluid mt-6"
            alt="Sample image"
          />
        </div>

        <div className="col-md-5 no-gap ">
          <div className="d-flex flex-row align-items-center justify-content-center mt-4">
            <p className="lead fw-normal mb-0 me-3">Sign in </p>
        </div>
        <p className='mt-3'>Please enter your email and password to login</p>

          <form>
            <div className="mb-4">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter your password"
              />
            </div>

            <div className="d-flex justify-content-between mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="rememberMe"
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  Remember me
                </label>
              </div>
              <a href="!#">Forgot password?</a>
            </div>

            <div className="text-center text-md-start mt-4 pt-2">
              <button className="btn mt-1 w-100" style={{ background: '#112D4E', borderRadius: 10 }}>
                <span className="text-white" style={{ fontSize: 15, fontFamily: 'Sansation', fontWeight: '400' }}>
                  Sign In
                </span>
              </button>
              <p className="small fw-bold mt-2 pt-1 mb-2 mb-4">
                Don't have an account? <Link to="/signup" className="link-danger">Sign up</Link>
              </p>
            </div>
          </form>
        </div>
        <div className='col-md-1'/>
      </div>
    </div>
  );
}

export default App;