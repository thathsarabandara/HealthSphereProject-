import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link,  useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

function PrescriptionView() {
  const [prescription, setPrescription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { reservationid, patientid } = useParams();

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/doctor/prescription/${reservationid}/${patientid}`, { withCredentials: true });
        if (response.data) {
          setPrescription(response.data);
          console.log(reservationid);
          console.log(patientid);
        } else {
          setError('Prescription not found');
        }
      } catch (error) {
        setError('Error fetching prescription. Please try again.');
        console.error('Error fetching prescription:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrescription();
  }, [reservationid, patientid]);

  // Loading State
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Error State
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-5 mb-5">
      <h3>Prescription Details</h3>
      <button className="btn btn-secondary mb-4">
        <Link to="/doctor/clinic" style={{ textDecoration: 'none', color: 'inherit' }}>
          <FaArrowLeft /> Back
        </Link>
      </button>
      {prescription ? (
        <div>
          <div className="prescription-detail">
            <h4>Patient Name: {prescription.patient_name}</h4>
            <div><strong>Date Issued:</strong> {prescription.date_issued.split('T')[0]}</div>
            <div><strong>Details:</strong> {prescription.details}</div>
          </div>

          <div className="special-comment">
            <h5>Special Comment:</h5>
            <p>{prescription.special_comments || 'No special comments.'}</p>
          </div>

          <div className="prescription-image">
            <h5>Prescription Image:</h5>
            {prescription.prescription_photo ? (
              <img 
                src={`http://localhost:5000/uploads/storage/patient/${patientid}/prescription/${reservationid}/${prescription.prescription_photo}`} 
                alt="Prescription" 
                style={{ maxWidth: '100%', height: 'auto' }} 
              />
            ) : (
              <p>No image available</p>
            )}
          </div>
        </div>
      ) : (
        <p>No prescription details available</p>
      )}
    </div>
  );
}

export default PrescriptionView;
