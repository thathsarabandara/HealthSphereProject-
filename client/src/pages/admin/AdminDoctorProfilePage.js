import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AdminDoctorProfilePage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor] = useState({
    id: 'DOC123',
    registrationDate: '2023-06-22',
    email: 'doctor@example.com',
    name: 'Dr. John Doe',
    dob: '1980-01-01',
    gender: 'Male',
    contact: '123-456-7890',
    address: '123 Main St, City',
    specialization: 'Cardiology',
    licenseNumber: 'LIC12345',
    experience: '10',
    qualifications: 'MD, Cardiology',
    hospitalName: 'City Hospital',
    hospitalAddress: '456 Hospital Ave, City',
    profilePicture: 'https://example.com/profile.jpg',
    medicalLicense: 'https://example.com/license.pdf',
    nationalId: 'NAT123456789',
    idFront: 'https://example.com/id-front.jpg',
    idBack: 'https://example.com/id-back.jpg'
  });

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
      
      <h2 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: 500 }}>Doctor Profile: {doctor.name}</h2>
      
      {/* Profile Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', paddingBottom: '25px', borderBottom: '1px solid #eee' }}>
        <img 
          src={doctor.profilePicture} 
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
          <h3 style={{ margin: '0 0 8px 0', fontWeight: 500, fontSize: '24px' }}>{doctor.name}</h3>
          <p style={{ margin: '0', color: '#666', fontSize: '18px' }}>{doctor.specialization}</p>
          <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '16px' }}>ID: {doctor.id}</p>
        </div>
      </div>
      
      <div>
        <h3 style={{ fontSize: '35px' }}>Personal Information</h3>
        <p><strong>Doctor ID:</strong> {doctor.id}</p>
        <p><strong>Registration Date:</strong> {doctor.registrationDate}</p>
        <p><strong>Email:</strong> {doctor.email}</p>
        <p><strong>Name:</strong> {doctor.name}</p>
        <p><strong>Date of Birth:</strong> {doctor.dob}</p>
        <p><strong>Gender:</strong> {doctor.gender}</p>
        <p><strong>Contact Number:</strong> {doctor.contact}</p>
        <p><strong>Address:</strong> {doctor.address}</p>
      </div>

      <div>
        <h3 style={{ fontSize: '35px' }}>Professional Information</h3>
        <p><strong>Specialization:</strong> {doctor.specialization}</p>
        <p><strong>License Number:</strong> {doctor.licenseNumber}</p>
        <p><strong>Experience:</strong> {doctor.experience} years</p>
        <p><strong>Qualifications:</strong> {doctor.qualifications}</p>
      </div>

      <div>
        <h3 style={{ fontSize: '35px' }}>Additional Information</h3>
        <p><strong>Hospital/Clinic Name:</strong> {doctor.hospitalName}</p>
        <p><strong>Hospital Address:</strong> {doctor.hospitalAddress}</p>
      </div>

      {/* Documents Section */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ marginBottom: '20px', fontWeight: 500, fontSize: '20px' }}>Verification Documents</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div>
            <h4 style={{ margin: '0 0 15px 0', fontWeight: 500, fontSize: '18px' }}>National ID: {doctor.nationalId}</h4>
            <div style={{ display: 'flex', gap: '25px' }}>
            <a 
              href={doctor.medicalLicense} 
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
              href={doctor.medicalLicense} 
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
