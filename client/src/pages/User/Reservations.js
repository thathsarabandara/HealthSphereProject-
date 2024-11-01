import React from 'react';

function Reservations() {
  return (
    <div>
      {/* Background color for the header */}
      <div className='container-fluid' style={{ padding: 0, margin: 0 }}>
        <div style={{ width: '100%', height: '100px', background: '#756A6A' }} />
      </div>

      {/* Form container */}
      <div className='container mt-5 mb-5' style={{ marginTop: '-50px', padding: '20px', background: '#F4F4F4', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
        <div className='row'>
          <h4>
            <input type="checkbox" style={{ marginRight: '10px' }} />
            Reservations Details
          </h4>
        </div>

        {/* Form fields */}
        <div className='row' style={{ marginTop: '20px' }}>
          <div className='col-9'>
            <form>
              <div style={{ marginBottom: '15px' }}>
                <label>Full Name</label>
                <input type="text" placeholder="Enter your full name" style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', background: '#ECECEC' }} />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Address</label>
                <textarea placeholder="Enter your address" style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', background: '#ECECEC', height: '80px' }}></textarea>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Phone Number</label>
                <input type="tel" placeholder="Enter your phone number" style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', background: '#ECECEC' }} />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Email Address</label>
                <input type="email" placeholder="Enter your email address" style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', background: '#ECECEC' }} />
              </div>
            </form>
          </div>

          {/* Button column */}
          <div className='col-3' style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className='btn' style={{ width: '100%', background: '#007802', color: 'white', borderRadius: '6px', padding: '10px' }}>Book</button>
          </div>
        </div>
      </div>
      </div>
  );
}

export default Reservations;
