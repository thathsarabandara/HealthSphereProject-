import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Loader from '../../components/common/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DiseaseForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [diseaseDetails, setDiseaseDetails] = useState('');
  const [specialComments, setSpecialComments] = useState('');
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { reservationid, patientid }= useParams();

  useEffect(() => {
    const loadingTimeout = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(loadingTimeout);
  }, []);

  const handleFileChange = (e) => {
    setPrescriptionFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    if (!diseaseDetails || !specialComments || !prescriptionFile) {
      setError('Please fill in all fields and upload a file.');
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('diseaseDetails', diseaseDetails);
      formData.append('specialComments', specialComments);
      formData.append('prescriptionFile', prescriptionFile);

      const response = await axios.post(`http://localhost:5000/doctor/clinic/${reservationid}/prescription/${patientid} `, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      toast.success('Prescription saved successfully!');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/doctor/clinic');
      }, 2000);
    } catch (error) {
      toast.error('Failed to save prescription');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f4f8',
          zIndex: 9999,
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <div className="container p-4" style={{ maxWidth: '600px' }}>
      {/* Back Button */}
      <button className="btn btn-secondary mb-4">
        <Link to="/doctor/clinic" style={{ textDecoration: 'none', color: 'inherit' }}>
          <FaArrowLeft /> Back
        </Link>
      </button>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        {/* Disease Details */}
        <div className="mb-3">
          <label htmlFor="diseaseDetails" className="form-label">
            Details about the disease
          </label>
          <textarea
            id="diseaseDetails"
            className="form-control"
            rows="2"
            style={{ backgroundColor: '#ede7e3' }}
            value={diseaseDetails}
            onChange={(e) => setDiseaseDetails(e.target.value)}
          ></textarea>
        </div>

        {/* Special Comments */}
        <div className="mb-3">
          <label htmlFor="specialComments" className="form-label">
            Special Comments
          </label>
          <textarea
            id="specialComments"
            className="form-control"
            rows="2"
            style={{ backgroundColor: '#ede7e3' }}
            value={specialComments}
            onChange={(e) => setSpecialComments(e.target.value)}
          ></textarea>
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label htmlFor="prescriptionFile" className="form-label">
            Prescription file/Photo
          </label>
          <input
            type="file"
            id="prescriptionFile"
            className="form-control"
            style={{ backgroundColor: '#ede7e3' }}
            onChange={handleFileChange}
          />
        </div>

        {/* Save Button */}
        <div className="text-end">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Saving...
              </>
            ) : 'Save Prescription'}
          </button>
        </div>
      </form>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default DiseaseForm;
