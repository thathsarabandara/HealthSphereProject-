import React from 'react';
import signup from '../../assets/images/Rectangle 84.svg';

function App() {
  return (
    <div className="container p-3 my-5 h-custom">
      <div className="row" style={{background: '#C8D8F6', borderRadius: 12}}>
      <div className='col-md-1'/>
        <div className="col-md-5 mt-5">
          <img
            src={signup}
            className="img-fluid"
            alt="Sample image"
          />
        </div>

        <div className="col-md-5">
        <div className="d-flex flex-column align-items-center justify-content-center mb-4">
            <p className="lead fw-bold mb-0 me-3 mt-4">Sign Up</p>
            <p
              style={{
                color: '#112D4E',
                fontSize: '12px',
                fontFamily: 'Sansation, sans-serif',
                fontWeight: 700,
                lineHeight: '18px',
                wordWrap: 'break-word',
                marginTop: '10px', // Added margin to separate the texts
              }}
            >
              Sign up and Work as Consultant at Health Sphere
            </p>
          </div>

          <form>
            <div className="mb-4">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="Enter your full name"
              />
            </div>

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
                    Agree to Our Terms of use and privacy Policy
                </label>
              </div>
              
            </div>

            <div className="text-center text-md-start mt-4 pt-2">
              <button
                type="submit"
                className="btn mt-1 w-100 mb-4"
                style={{ background: '#112D4E', borderRadius: 10 }}
              >
                <span
                  className="text-white "
                  style={{
                    fontSize: 15,
                    fontFamily: 'Sansation',
                    fontWeight: 400,
                  }}
                >
                  Sign Up
                </span>
              </button>
              
            </div>
          </form>
        </div>
        <div className='col-md-1'/>
      </div>
    </div>
  );
}

export default App;
