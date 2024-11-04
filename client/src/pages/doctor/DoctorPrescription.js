import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

function DiseaseForm() {
  return (
    <div className="container p-4" style={{ maxWidth: '600px' }}>
      {/* Back Button */}
      <button className="btn btn-secondary mb-4">
      <Link to='/doctor/clinic' style={{ textDecoration: 'none', color: 'inherit' }}><FaArrowLeft /> Back</Link>
        
      </button>

      {/* Form */}
      <form>
        {/* Disease Details */}
        <div className="mb-3">
          <label htmlFor="diseaseDetails" className="form-label">Details about the disease</label>
          <textarea 
            id="diseaseDetails" 
            className="form-control" 
            rows="2" 
            style={{ backgroundColor: '#ede7e3' }}
          ></textarea>
        </div>

        {/* Special Comments */}
        <div className="mb-3">
          <label htmlFor="specialComments" className="form-label">Special Comments</label>
          <textarea 
            id="specialComments" 
            className="form-control" 
            rows="2" 
            style={{ backgroundColor: '#ede7e3' }}
          ></textarea>
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label htmlFor="prescriptionFile" className="form-label">Prescription file/Photo</label>
          <input 
            type="file" 
            id="prescriptionFile" 
            className="form-control" 
            style={{ backgroundColor: '#ede7e3' }}
          />
        </div>

        {/* Save Button */}
        <div className="text-end">
          <button type="submit" className="btn" style={{background: '#C8D8F6' , color: 'black'}}>Save</button>
        </div>
      </form>
    </div>
  );
}

export default DiseaseForm;
