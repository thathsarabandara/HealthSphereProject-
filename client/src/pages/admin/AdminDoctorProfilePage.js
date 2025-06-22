import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDoctorProfilePage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/admin/doctor/${doctorId}`);
        console.log(response.data)
        setDoctor(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch doctor data');
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!doctor) return <div>Doctor not found</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate(-1)}
        style={{
          padding: '8px 16px',
          backgroundColor: '#7B61FF',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        &larr; Back
      </button>
      
      <h2 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: 500 }}>Doctor Profile: {doctor.first_name + " " + doctor.last_name}</h2>
      
      {/* Profile Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', paddingBottom: '25px', borderBottom: '1px solid #eee' }}>
        <img 
          src={`http://localhost:5000/uploads/storage/doctor/${doctor.user_id}/profiledocuments/${doctor.profile_picture}`} 
          alt="Profile" 
          style={{ 
            width: '180px', 
            height: '180px', 
            borderRadius: '50%',
            objectFit: 'cover',
            border: '1px solid #f0f0f0'
          }} 
        />
        <div style={{ marginLeft: '30px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontWeight: 500, fontSize: '24px' }}>{doctor.first_name + " " + doctor.last_name}</h3>
          <p style={{ margin: '0', color: '#666', fontSize: '18px' }}>{doctor.specialization}</p>
          <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '16px' }}>ID: {doctor.id}</p>
        </div>
      </div>
      
      <div>
        <h3 style={{ fontSize: '35px' }}>Personal Information</h3>
        <p><strong>Doctor ID:</strong> {doctor.id}</p>
        <p><strong>Registration Date:</strong> {doctor.created_at.split('T')[0]}</p>
        <p><strong>Email:</strong> {doctor.email}</p>
        <p><strong>Name:</strong> {doctor.first_name + " " + doctor.last_name}</p>
        <p><strong>Date of Birth:</strong> {doctor.date_of_birth.split('T')[0]}</p>
        <p><strong>Gender:</strong> {doctor.gender}</p>
        <p><strong>Contact Number:</strong> {doctor.phone_number}</p>
        <p><strong>Address:</strong> {doctor.address}</p>
      </div>

      <div>
        <h3 style={{ fontSize: '35px' }}>Professional Information</h3>
        <p><strong>Specialization:</strong> {doctor.specialization}</p>
        <p><strong>License Number:</strong> {doctor.medical_license_number}</p>
        <p><strong>Experience:</strong> {doctor.experience} years</p>
      </div>

      <div>
        <h3 style={{ fontSize: '35px' }}>Additional Information</h3>
        <p><strong>Hospital/Clinic Name:</strong> {doctor.hospital_clinic_affiliation}</p>
        <p><strong>Medical School University:</strong> {doctor.medical_school_university}</p>
      </div>

      {/* Documents Section */}
      <div style={{ marginBottom: '40px' ,marginBottom: '20px'}}>
        <h3 style={{ marginBottom: '20px', fontWeight: 500, fontSize: '35px' }}>Verification Documents</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div>
            <h4 style={{ margin: '0 0 15px 0', fontWeight: 500, fontSize: '18px' }}>National ID: {doctor.nationalId}</h4>
            <div style={{ display: 'flex', gap: '25px' }}>
            <a 
              href={`http://localhost:5000/uploads/storage/doctor/${doctor.user_id}/profiledocuments/${doctor.national_id_passport}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                padding: '12px 18px',
                backgroundColor: '#f8f9fa',
                color: '#333',
                borderRadius: '6px',
                textDecoration: 'none',
                border: '1px solid #eee',
                fontSize: '16px',
                fontWeight: 500
              }}
            >
              <span style={{ marginRight: '10px', fontSize: '20px' }}>📄</span> View National ID
            </a>
            </div>
          </div>
          
          <div>
            <h4 style={{ margin: '0 0 15px 0', fontWeight: 500, fontSize: '18px' }}>Medical License</h4>
            <a 
              href={`http://localhost:5000/uploads/storage/doctor/${doctor.user_id}/profiledocuments/${doctor.medical_license_document}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                padding: '12px 18px',
                backgroundColor: '#f8f9fa',
                color: '#333',
                borderRadius: '6px',
                textDecoration: 'none',
                border: '1px solid #eee',
                fontSize: '16px',
                fontWeight: 500
              }}
            >
              <span style={{ marginRight: '10px', fontSize: '20px' }}>📄</span> View License Document
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDoctorProfilePage;
