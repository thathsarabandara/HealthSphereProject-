import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function RegistrationForm() {
  return (
    <div className="container p-4 mt-5 mb-5" style={{ maxWidth: '800px', borderRadius: '8px', backgroundColor: '#f5f5f5' }}>
      <div className="row mb-4">
        {/* Profile Picture and Edit Button */}
        <div className="col-12 col-md-4 text-center">
          <div className="d-inline-block" style={{ width: '180px', height: '180px', borderRadius: '50%', backgroundColor: '#d9b4b4' }}></div>
          <div className="mt-2">
            <button className="btn  btn-sm" style={{background: '#C8D8F6'}}>Edit Profile Picture</button>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="col-12 col-md-8">
          <h5>Personal Information</h5>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Patient ID</label>
              <input type="text" className="form-control" style={{background: '#ECE6E6'}} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Registration Date</label>
              <input type="date" className="form-control" style={{background: '#ECE6E6'}} />
            </div>
            <div className="col-md-6">
              <label className="form-label">First Name</label>
              <input type="text" className="form-control" style={{background: '#ECE6E6'}} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Last Name</label>
              <input type="text" className="form-control" style={{background: '#ECE6E6'}} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone Number</label>
              <input type="tel" className="form-control"  style={{background: '#ECE6E6'}}/>
            </div>
            <div className="col-md-6">
              <label className="form-label">Gender</label>
              <select className="form-control" style={{background: '#ECE6E6'}}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">Email</label>
              <input type="email" className="form-control"style={{background: '#ECE6E6'}} />
            </div>
            <div className="col-12">
              <label className="form-label">Address</label>
              <textarea className="form-control" rows="2" style={{background: '#ECE6E6'}}></textarea>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="row mb-4">
        <div className="col-12">
          <label className="form-label">Description of you</label>
          <textarea className="form-control" rows="3" style={{ backgroundColor: '#ede7e3' }}></textarea>
        </div>
      </div>

      {/* Professional Information Section */}
      <h5>Professional Information</h5>
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Medical License Number</label>
          <input type="text" className="form-control" style={{background: '#ECE6E6'}}/>
        </div>
        <div className="col-md-6">
          <label className="form-label">Specialization</label>
          <input type="text" className="form-control" style={{background: '#ECE6E6'}} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Years of Experience</label>
          <input type="number" className="form-control" style={{background: '#ECE6E6'}} />
        </div>
        <div className="col-12">
          <label className="form-label">Hospital/Clinic Affiliation</label>
          <input type="text" className="form-control" style={{background: '#ECE6E6'}}/>
        </div>
        <div className="col-12">
          <label className="form-label">Medical School/University</label>
          <input type="text" className="form-control" style={{background: '#ECE6E6'}} />
        </div>
      </div>

      {/* Identification Documents Section */}
      <h5>Identification Documents</h5>
      <div className="mb-3">
        <label className="form-label">National ID/Passport</label>
        <input type="file" className="form-control" style={{background: '#ECE6E6'}}/>
      </div>
      <div className="mb-3">
        <label className="form-label">Medical License Document</label>
        <input type="file" className="form-control" style={{background: '#ECE6E6'}} />
      </div>
      <div className="mb-4">
        <label className="form-label">Professional Certifications</label>
        <input type="file" className="form-control" style={{background: '#ECE6E6'}}/>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button type="submit" className="btn btn-success btn-lg">Request for Registration</button>
      </div>
    </div>
  );
}

export default RegistrationForm;

