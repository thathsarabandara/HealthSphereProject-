import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Loader from '../../../components/common/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

// Function to format date and time from ISO string
const formatDateTime = (isoString) => {
  if (!isoString) return { date: 'N/A', time: 'N/A' };
  
  try {
    const date = new Date(isoString);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    return { date: formattedDate, time: formattedTime };
  } catch (error) {
    console.error('Error formatting date:', error);
    return { date: 'Invalid Date', time: 'Invalid Time' };
  }
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#112D4E',
    color: theme.palette.common.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Refund = () => {
  const navigate = useNavigate();
  const [refundData, setRefundData] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/refund', {withCredentials: true}); 
        setRefundData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = refundData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(refundData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleRequestRefund = async (bookingId) => {
    try {
      const response = await axios.post(`http://localhost:5000/refund/${bookingId}`, {withCredentials: true});
      toast.success('Refund requested successfully!');
    } catch (error) {
      toast.error('Failed to request refund.');
      console.error('Error requesting refund:', error);
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
    <div className="container mt-4" style={{ minHeight: '70vh' }}>
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Refund Requests</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Payment Id</StyledTableCell>
              <StyledTableCell>Payment Date</StyledTableCell>
              <StyledTableCell>Payment Time</StyledTableCell>
              <StyledTableCell>Payment Amount</StyledTableCell>
              <StyledTableCell>Refund Id</StyledTableCell>            
              <StyledTableCell>Request Date</StyledTableCell>
              <StyledTableCell>Request Time</StyledTableCell>
              <StyledTableCell>Refund Reason</StyledTableCell>
              <StyledTableCell>Refund Status</StyledTableCell>
            </TableRow>
          </TableHead>
          {currentItems.length === 0 ? (
            <div className="text-center p-5">No data found</div>
          ) : (
            <TableBody>
              {currentItems.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{row.paymentId}</StyledTableCell>
                  <StyledTableCell>{formatDateTime(row.paymentDate).date}</StyledTableCell>
                  <StyledTableCell>{formatDateTime(row.paymentDate).time}</StyledTableCell>
                  <StyledTableCell>LKR {parseFloat(row.paymentAmount).toFixed(2)}</StyledTableCell>
                  <StyledTableCell>{row.refundId || 'N/A'}</StyledTableCell>
                  <StyledTableCell>{row.refundRequestDate ? formatDateTime(row.refundRequestDate).date : 'N/A'}</StyledTableCell>
                  <StyledTableCell>{row.refundRequestTime ? formatDateTime(row.refundRequestTime).time : 'N/A'}</StyledTableCell>
                  <StyledTableCell>{row.refundReason}</StyledTableCell>
                  <StyledTableCell>{row.refundStatus}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      {/* Pagination */}
      <nav>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => paginate(currentPage - 1)}>
              Previous
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
              <button className="page-link" onClick={() => paginate(number)}>
                {number}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => paginate(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Refund;
