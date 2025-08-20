import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { Container, Card, Button, ListGroup, ListGroupItem } from 'react-bootstrap';

function PrescriptionView() {
  const [prescription, setPrescription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { reservationid, patientid } = useParams();

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/prescription/${reservationid}`, { withCredentials: true });
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
    <Container className="mt-4" style={{ minHeight: '70vh' }}>
      <Button as={Link} to="/prescriptionhistory" variant="outline-secondary" className="mb-4">
        <FaArrowLeft /> Back
      </Button>
      <h3 className="mb-4">Prescription Details</h3>
      {prescription ? (
        <Card>
          <Card.Header as="h5">Prescription ID: {prescription.prescription_id}</Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              <ListGroupItem><strong>Patient Name:</strong> {prescription.patient_name}</ListGroupItem>
              <ListGroupItem><strong>Date Issued:</strong> {prescription.date_issued.split('T')[0]}</ListGroupItem>
              <ListGroupItem><strong>Details:</strong> {prescription.details}</ListGroupItem>
              <ListGroupItem><strong>Special Comments:</strong> {prescription.special_comments || 'No special comments.'}</ListGroupItem>
              <ListGroupItem>
                <strong>Prescription Image:</strong> 
                {prescription.prescription_photo ? (
                  <img 
                    src={`http://localhost:5000/uploads/storage/patient/${patientid}/prescription/${reservationid}/${prescription.prescription_photo}`} 
                    alt="Prescription" 
                    style={{ maxWidth: '100%', height: 'auto' }} 
                  />
                ) : (
                  <p>No image available</p>
                )}
              </ListGroupItem>
            </ListGroup>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body>No prescription details available</Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default PrescriptionView;
