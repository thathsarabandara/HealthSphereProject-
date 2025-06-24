import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import Loader from '../../../components/common/Loader';
import { useNavigate } from 'react-router-dom';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background: '#112D4E',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
    borderRadius: '10px',
    marginBottom: '10px',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function CustomizedTable() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/userprescription', { withCredentials: true });
        setRows(response.data || []);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const handleDoctorProfile = (id) => {
    navigate(`/profileDoctor/${id}`);
  };

  const handlePrescription = (patientId, reservationId) => {
    navigate(`/prescriptionhistory/${patientId}/viewprescription/${reservationId}`);
  };

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = rows.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(rows.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4" style={{ minHeight: '70vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Prescription History</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell style={{ fontWeight: 'bold' }}>Reservation Id</StyledTableCell>
              <StyledTableCell style={{ fontWeight: 'bold' }}>Date</StyledTableCell>
              <StyledTableCell style={{ fontWeight: 'bold' }}>Time</StyledTableCell>
              <StyledTableCell style={{ fontWeight: 'bold' }}>Doctor Id</StyledTableCell>
              <StyledTableCell style={{ fontWeight: 'bold' }}>Doctor Name</StyledTableCell>
              <StyledTableCell style={{ fontWeight: 'bold' }}>Doctor Profile View</StyledTableCell>
              <StyledTableCell style={{ fontWeight: 'bold' }}>Prescription Id</StyledTableCell>
              <StyledTableCell style={{ fontWeight: 'bold' }}>Details</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>{row.reservation_id}</StyledTableCell>
                <StyledTableCell>{row.date}</StyledTableCell>
                <StyledTableCell>{row.time}</StyledTableCell>
                <StyledTableCell>{row.doctor_id}</StyledTableCell>
                <StyledTableCell>{row.doctor_name}</StyledTableCell>
                <StyledTableCell>
                  <button
                    style={{
                      display: 'inline-block',
                      outline: 'none',
                      cursor: 'pointer',
                      fontWeight: 500,
                      border: '1px solid transparent',
                      borderRadius: '5px',
                      height: '36px',
                      lineHeight: '34px',
                      fontSize: '14px',
                      color: 'black',
                      backgroundColor: '#C8D8F6',
                      transition: 'background-color 0.2s ease-in-out, opacity 0.2s ease-in-out',
                      padding: '0 18px',
                    }}
                    onClick={() => handleDoctorProfile(row.doctor_id)}
                  >
                    View
                  </button>
                </StyledTableCell>
                <StyledTableCell>{row.prescription_id}</StyledTableCell>
                <StyledTableCell>
                  <button
                    style={{
                      display: 'inline-block',
                      outline: 'none',
                      cursor: 'pointer',
                      fontWeight: 500,
                      border: '1px solid transparent',
                      borderRadius: '5px',
                      height: '36px',
                      lineHeight: '34px',
                      fontSize: '14px',
                      color: 'white',
                      backgroundColor: '#2A5D9C',
                      transition: 'background-color 0.2s ease-in-out, opacity 0.2s ease-in-out',
                      padding: '0 18px',
                    }}
                    onClick={() => handlePrescription(row.patient_id, row.reservation_id)}
                  >
                    Details
                  </button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination */}
      <nav>
        <ul className="pagination">
          <li className="page-item">
            <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
          </li>
          {[...Array(totalPages).keys()].map((pageNumber) => (
            <li key={pageNumber} className="page-item">
              <button className="page-link" onClick={() => paginate(pageNumber + 1)}>
                {pageNumber + 1}
              </button>
            </li>
          ))}
          <li className="page-item">
            <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
